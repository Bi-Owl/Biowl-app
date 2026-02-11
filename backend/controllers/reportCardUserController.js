const Exam = require('../models/exam');
const UserExamAttempt = require('../models/userExamAttempt');
const ReportCard = require('../models/reportCard');
const Question = require('../models/question');
const Explanation = require('../models/explanation');

/**
 * Calculates the score for a given attempt against the correct answers.
 * @param {object} userAnswers - The user's answers, e.g., { '1': 2, '2': 3 }
 * @param {object} correctAnswers - The correct answers, e.g., { '1': 2, '2': 4 }
 * @param {Array} questions - Array of all questions in the exam.
 * @returns {object} - The calculated score details.
 */
const calculateScore = (userAnswers, correctAnswers, questions) => {
  let correctCount = 0;
  let incorrectCount = 0;
  let totalWeightedScore = 0;
  const totalQuestions = questions.length;

  for (const question of questions) {
    const questionId = question.id.toString();
    const userAnswer = userAnswers[questionId];
    const correctAnswer = correctAnswers[questionId];

    if (userAnswer) {
      if (question.type === 'numeric') {
        let correctAnswersList = [];
        if (Array.isArray(correctAnswer)) {
          correctAnswersList = correctAnswer;
        } else if (typeof correctAnswer === 'string') {
          try {
            correctAnswersList = JSON.parse(correctAnswer);
          } catch (e) {
            if (correctAnswer.includes(',')) {
              correctAnswersList = correctAnswer.split(',').map(s => parseFloat(s.trim()));
            } else {
              correctAnswersList = [parseFloat(correctAnswer)];
            }
          }
        } else if (typeof correctAnswer === 'number') {
          correctAnswersList = [correctAnswer];
        }

        const userFloat = parseFloat(userAnswer);
        if (correctAnswersList.some(ans => Math.abs(parseFloat(ans) - userFloat) < 0.0001)) {
          correctCount++;
          totalWeightedScore += 4;
        }
      } else if (question.type === 'multi_boolean') {
        let userBools = [];
        try {
          userBools = Array.isArray(userAnswer) ? userAnswer : JSON.parse(userAnswer);
        } catch (e) {
          userBools = [];
        }

        let correctBools = [];
        try {
          correctBools = Array.isArray(correctAnswer) ? correctAnswer : JSON.parse(correctAnswer);
        } catch (e) {
          correctBools = [];
        }

        if (Array.isArray(userBools) && Array.isArray(correctBools)) {
          let qCorrect = 0;
          let qIncorrect = 0;
          for (let k = 0; k < 5; k++) {
            if (userBools[k] === true || userBools[k] === false) {
              if (userBools[k] === correctBools[k]) qCorrect++;
              else qIncorrect++;
            }
          }

          let tablePoints = 0;
          if (qCorrect === 5) tablePoints = 5;
          else if (qCorrect === 4) tablePoints = 3;
          else if (qCorrect === 3) tablePoints = 2;
          else if (qCorrect === 2) tablePoints = 1;

          const penalty = qIncorrect * 0.5;
          const finalPoints = tablePoints - penalty;
          totalWeightedScore += (finalPoints / 5) * 4;

          if (qCorrect === 5) correctCount++;
          else if (qIncorrect > 0) incorrectCount++;
        }
      } else {
        if (parseInt(userAnswer) === parseInt(correctAnswer)) {
          correctCount++;
          totalWeightedScore += 4;
        } else {
          incorrectCount++;
          totalWeightedScore -= 1;
        }
      }
    }
  }

  const unansweredCount = (totalQuestions - correctCount - incorrectCount) < 0 ? 0 : (totalQuestions - correctCount - incorrectCount);
  const maxScore = totalQuestions * 4;
  const percentageWithNegative = maxScore > 0 ? (totalWeightedScore / maxScore) * 100 : 0;
  const percentageWithoutNegative = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

  return {
    correctCount,
    incorrectCount,
    unansweredCount,
    totalQuestions,
    percentageWithNegative: parseFloat((percentageWithNegative > 100 ? 100 : percentageWithNegative).toFixed(2)),
    percentageWithoutNegative: parseFloat(percentageWithoutNegative.toFixed(2)),
  };
};

/**
 * @desc    Get all available (visible) report cards for the logged-in user.
 * @route   GET /api/report-cards
 * @access  Private
 */
exports.getAvailableReportCards = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all exams the user has purchased
    const userExams = await Exam.findAll({
      include: [
        {
          model: ReportCard,
          where: { isHidden: false }, // Only get visible report cards
          required: true, // INNER JOIN
        },
        {
          model: UserExamAttempt,
          where: { UserId: userId },
          attributes: ['status'],
          required: true, // INNER JOIN to ensure user has an attempt
        }
      ],
      order: [[ReportCard, 'createdAt', 'DESC']]
    });

    res.json(userExams);
  } catch (error) {
    console.error('Error fetching available report cards:', error);
    res.status(500).json({ message: 'خطا در دریافت لیست کارنامه‌ها.' });
  }
};

/**
 * @desc    Get the detailed result for a specific report card
 * @route   GET /api/report-cards/:examId
 * @access  Private
 */
exports.getReportCardDetails = async (req, res) => {
  try {
    const { examId } = req.params;
    const userId = req.user.id;

    // 1. Find the report card and ensure it's visible
    const reportCard = await ReportCard.findOne({
      where: { ExamId: examId, isHidden: false },
    });

    if (!reportCard) {
      return res.status(404).json({ message: 'کارنامه یافت نشد یا هنوز منتشر نشده است.' });
    }

    // 2. Find the user's attempt for this exam
    const attempt = await UserExamAttempt.findOne({
      where: { ExamId: examId, UserId: userId },
    });

    if (!attempt || attempt.status !== 'completed') {
      return res.status(403).json({ message: 'شما این آزمون را به پایان نرسانده‌اید و نمی‌توانید کارنامه را مشاهده کنید.' });
    }

    // 3. Fetch all questions for the exam (we need them for score calculation)
    const questions = await Question.findAll({ where: { ExamId: examId } });

    // Fetch all explanations for the exam
    const explanations = await Explanation.findAll({ where: { ExamId: examId } });

    // 4. Calculate score
    const score = calculateScore(attempt.answers, reportCard.correctAnswers, questions);

    // 5. Send all data back
    res.json({
      reportCard,
      attempt,
      questions,
      explanations, // Include explanations here
      score,
    });

  } catch (error) {
    console.error('Error fetching report card details:', error);
    res.status(500).json({ message: 'خطا در دریافت جزئیات کارنامه.' });
  }
};

/**
 * @desc    Get summary of the latest report card for the logged-in user
 * @route   GET /api/report-cards/latest-summary
 * @access  Private
 */
exports.getLatestReportCardSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the latest exam the user has completed an attempt for and has a visible report card
    const latestExamWithReportCard = await Exam.findOne({
      include: [{
        model: ReportCard,
        where: { isHidden: false },
        required: true,
      }, {
        model: UserExamAttempt,
        where: { UserId: userId, status: 'completed' },
        required: true,
        attributes: [], // We only need it for the join condition
      }],
      order: [['id', 'DESC']], // Order by exam id to get latest published
    });

    if (!latestExamWithReportCard) {
      return res.status(404).json({ message: 'کارنامه تکمیل شده‌ای یافت نشد.' });
    }

    // Now fetch details for this specific latest report card
    const reportCard = await ReportCard.findOne({
      where: { ExamId: latestExamWithReportCard.id, isHidden: false },
    });
    const attempt = await UserExamAttempt.findOne({
      where: { ExamId: latestExamWithReportCard.id, UserId: userId, status: 'completed' },
    });
    const questions = await Question.findAll({ where: { ExamId: latestExamWithReportCard.id } });

    const score = calculateScore(attempt.answers, reportCard.correctAnswers, questions);

    res.json({
      examName: latestExamWithReportCard.name,
      reportCardId: reportCard.id,
      percentage: score.percentageWithNegative,
      // Add more fields if needed
    });

  } catch (error) {
    console.error('Error fetching latest report card summary:', error);
    res.status(500).json({ message: 'خطا در دریافت خلاصه آخرین کارنامه.' });
  }
};
