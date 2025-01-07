const ExamSession = require("../model/examModel");
const Question = require("../model/questionModel");
const Result = require("../model/resultModel");
const User = require("../model/userModel");
const nodemailer = require("nodemailer");

// const submitAnswer = async (req, res) => {
//   const { answers, email } = req.body;

//   try {
//     // Find the user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const questions = await Question.find();

//     // Calculate scores and prepare results
//     let score = 0;
//     let wrongCount = 0;

//     const results = questions.map((q, index) => {
//       const isCorrect = answers[index] === q.answer;
//       if (isCorrect) {
//         score += 1;
//       } else if (answers[index] !== undefined) {
//         wrongCount += 1;
//       }

//       return {
//         question: q.question,
//         correctAnswer: q.options[q.answer],
//         yourAnswer:
//           answers[index] !== undefined
//             ? q.options[answers[index]]
//             : "Unanswered",
//         isCorrect,
//       };
//     });

//     const negativeMarking = Math.floor(wrongCount / 3);
//     score -= negativeMarking;
//     // Save the result in the database
//     const newResult = new Result({
//       userId: user._id,
//       score,
//       wrongCount,
//       negativeMarking,
//       results,
//       email,
//     });

//     await newResult.save();

//     // Associate the result with the user
//     user.result.push(newResult._id);
//     await user.save();
//     // sendEmail(
//     //   email,
//     //   score,
//     //   results,
//     //   user?.name,
//     //   negativeMarking,
//     //   wrongCount,
//     //   res
//     // );

//     res.json({ message: "Result saved successfully", newResult });
//   } catch (error) {
//     res.status(500).json({ message: "Error saving result", error });
//   }
// };

// const submitAnswer = async (req, res) => {
//   const { answers, email } = req.body;

//   try {
//     // Find the user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Fetch all questions from the database
//     const questions = await Question.find();

//     if (questions.length === 0) {
//       return res.status(404).json({ message: "No questions found" });
//     }

//     // Initialize score, wrongCount, and other counters
//     let score = 0;
//     let wrongCount = 0;
//     let totalQuestions = questions.length;
//     let totalAttempted = 0;

//     // Calculate scores and prepare results
//     const results = questions.map((q, index) => {
//       const userAnswer = answers[index]; // Get the user's answer for this question

//       // Check if the question was skipped
//       const isSkipped =
//         userAnswer === undefined || userAnswer === null || userAnswer === -1;

//       // Determine the result status
//       let resultStatus;
//       if (isSkipped) {
//         resultStatus = "Not Answered";
//       } else if (userAnswer === q.answer) {
//         resultStatus = "Correct";
//         score += 1; // Increment score for correct answers
//         totalAttempted += 1; // Increment attempted count
//       } else {
//         resultStatus = "Incorrect";
//         wrongCount += 1; // Increment wrong count for incorrect answers
//         totalAttempted += 1; // Increment attempted count
//       }

//       return {
//         question: q.question,
//         correctAnswer: q.options[q.answer],
//         yourAnswer: !isSkipped ? q.options[userAnswer] : "Unanswered",
//         isCorrect: resultStatus, // Replace "isCorrect" with "result"
//       };
//     });

//     // Apply negative marking
//     const negativeMarking = Math.floor(wrongCount / 3);
//     score -= negativeMarking;

//     // Total questions left
//     const totalUnAttempted = totalQuestions - totalAttempted;

//     // Save the result in the database
//     const newResult = new Result({
//       userId: user._id,
//       score,
//       wrongCount,
//       negativeMarking,
//       totalAttempted,
//       totalUnAttempted,
//       results,
//       email,
//     });

//     await newResult.save();

//     // Associate the result with the user
//     user.result.push(newResult._id);
//     await user.save();

//     res.json({
//       message: "Result saved successfully",
//       result: {
//         score,
//         wrongCount,
//         negativeMarking,
//         totalAttempted,
//         totalUnAttempted,
//         details: results,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error saving result", error });
//   }
// };
const submitAnswer = async (req, res) => {
  const { answers, email } = req.body;

  try {
    // Find the user
    const user = await User.findOne({ email });
    console.log(user?.study);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the exam session for the user
    const examSession = await ExamSession.findOne({ userId: user._id });
    if (!examSession) {
      return res.status(404).json({ message: "Exam session not found" });
    }

    // Check if the exam is still active or completed
    const currentTime = new Date();
    const endTime = new Date(
      examSession.examStartTime.getTime() + examSession.examDuration * 60000
    );

    if (currentTime > endTime || examSession.isCompleted) {
      // Automatically mark the exam as completed if time expires
      examSession.isCompleted = true;
      await examSession.save();
    }

    // Fetch all questions from the database

    const questions = await Question.find({ study: user?.study });

    if (questions.length === 0) {
      return res.status(404).json({ message: "No questions found" });
    }

    // Initialize score, wrongCount, and other counters
    let score = 0;
    let wrongCount = 0;
    let totalQuestions = questions.length;
    let totalAttempted = 0;

    // Calculate scores and prepare results
    const results = questions.map((q, index) => {
      const userAnswer = answers[index]; // Get the user's answer for this question

      // Check if the question was skipped
      const isSkipped =
        userAnswer === undefined || userAnswer === null || userAnswer === -1;

      // Determine the result status
      let resultStatus;
      if (isSkipped) {
        resultStatus = "Not Answered";
      } else if (userAnswer === q.answer) {
        resultStatus = "Correct";
        score += 1; // Increment score for correct answers
        totalAttempted += 1; // Increment attempted count
      } else {
        resultStatus = "Incorrect";
        wrongCount += 1; // Increment wrong count for incorrect answers
        totalAttempted += 1; // Increment attempted count
      }

      return {
        question: q.question,
        correctAnswer: q.options[q.answer], // Correct answer
        yourAnswer: !isSkipped ? q.options[userAnswer] : "Unanswered", // User's answer or "Unanswered"
        result: resultStatus, // Correctly set result status
      };
    });

    // Apply negative marking
    const negativeMarking = Math.floor(wrongCount / 3);
    score -= negativeMarking;

    // Total questions left
    const totalUnAttempted = totalQuestions - totalAttempted;

    // Save the result in the database
    const newResult = new Result({
      userId: user._id,
      score,
      wrongCount,
      negativeMarking,
      totalAttempted,
      totalUnAttempted,
      results,
      email,
    });

    await newResult.save();

    // Associate the result with the user
    user.result.push(newResult._id);
    await user.save();

    // Mark the exam session as completed
    examSession.isCompleted = true;
    await examSession.save();

    sendEmail(
      email,
      score,
      results,
      user.name,
      negativeMarking,
      wrongCount,
      totalAttempted,
      totalUnAttempted
    );

    res.json({
      message: "Result saved successfully and please check your email to get your result",
      result: {
        score,
        wrongCount,
        negativeMarking,
        totalAttempted,
        totalUnAttempted,
        details: results,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error saving result", error });
  }
};

const sendEmail = (
  email,
  score,
  results,
  name,
  negativeMarking,
  wrongCount,
  totalAttempted,
  totalUnAttempted
) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: "iwjy luqt bnrd xuij",
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Exam Results",
    text: `Hi ${name},\n\nYour Score: ${score}\nWrong Answers: ${wrongCount}\nNegative Marking: ${negativeMarking} \nTotal Attempted: ${totalAttempted}\nTotal UnAttempted: ${totalUnAttempted}\n\nThank you for participating in the exam. Detailed feedback is as follows:\n\n${results
      .map(
        (r) =>
          `Question: ${r.question}\nYour Answer: ${r.yourAnswer}\nCorrect Answer: ${r.correctAnswer}\nResult: ${r.result}\n`
      )
      .join("\n")}\n\nBest Regards,\nExam Team`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return error;
      }
      resolve(info);
    });
  });
};

const startExam = async (req, res) => {
  const { email, examDuration } = req.body;

  try {
    // Ensure the user is valid
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the exam is already started or completed
    let examSession = await ExamSession.findOne({ userId: user._id });
    if (examSession) {
      if (examSession.isCompleted) {
        return res.status(400).json({
          message: "Exam already completed.",
          isCompleted: examSession.isCompleted,
        });
      } else {
        return res.status(400).json({ message: "Exam already started." });
      }
    }

    // Start the exam
    examSession = new ExamSession({
      userId: user._id,
      examStartTime: new Date(),
      examDuration,
    });

    await examSession.save();

    res.json({
      message: "Exam started successfully",
      examStartTime: examSession.examStartTime,
      examDuration: examSession.examDuration,
    });
  } catch (error) {
    res.status(500).json({ message: "Error starting exam", error });
  }
};

const getRemainingTime = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const examSession = await ExamSession.findOne({ userId: user._id });
    if (!examSession) {
      return res.status(404).json({ message: "Exam session not found" });
    }

    if (examSession.isCompleted) {
      return res.json({ message: "Exam already completed", timeLeft: 0 });
    }

    // Calculate remaining time
    const currentTime = new Date();
    const endTime = new Date(
      examSession.examStartTime.getTime() + examSession.examDuration * 60000
    );
    const timeLeft = Math.max(0, Math.floor((endTime - currentTime) / 1000)); // Time in seconds

    if (timeLeft === 0) {
      examSession.isCompleted = true; // Auto-complete the exam
      await examSession.save();
    }

    res.json({
      timeLeft,
      status: timeLeft === 0 ? "Expired" : "Ongoing",
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching timer", error });
  }
};

module.exports = {
  submitAnswer,
  startExam,
  getRemainingTime,
};
