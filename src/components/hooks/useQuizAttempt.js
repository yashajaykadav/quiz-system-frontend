// src/hooks/useQuizAttempt.js
import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentApi } from '../../api/studentApi';

const MAX_WARNINGS = 3;

export const useQuizAttempt = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [attempt, setAttempt] = useState(null);
    const [quizMeta, setQuizMeta] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [warningCount, setWarningCount] = useState(0);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [autoSubmitted, setAutoSubmitted] = useState(false);
    const [infoModal, setInfoModal] = useState(null);
    const [confirmModal, setConfirmModal] = useState(null);

    const attemptRef = useRef(null);
    const fetchedRef = useRef(false);

    useEffect(() => { attemptRef.current = attempt; }, [attempt]);

    // ── Modal helpers ─────────────────────────────────────────────────────────
    const showInfo = (message, type = 'info') =>
        new Promise((resolve) =>
            setInfoModal({
                message,
                type,
                onClose: () => { setInfoModal(null); resolve(); },
            })
        );

    const showConfirm = (message) =>
        new Promise((resolve) =>
            setConfirmModal({
                message,
                onConfirm: () => { setConfirmModal(null); resolve(true); },
                onCancel: () => { setConfirmModal(null); resolve(false); },
            })
        );

    // ── Start quiz ────────────────────────────────────────────────────────────
    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        startQuiz();
    }, [quizId]);

    const startQuiz = async () => {
        try {
            const { data: attemptData } = await studentApi.startQuiz(quizId);

            // ── Guard: backend returned a completed attempt ───────────────
            if (attemptData?.status === 'COMPLETED') {
                setLoading(false);                              // ← stop spinner FIRST
                await showInfo('You have already completed this quiz.', 'error');
                navigate('/student');
                return;
            }

            setAttempt(attemptData);
            setWarningCount(attemptData.warningCount || 0);
            setQuizMeta({
                title: attemptData.quizTitle,
                subjectName: attemptData.subjectName,
                topicName: attemptData.topicName,
                durationMinutes: attemptData.durationMinutes,
            });

            const { data: answersData } = await studentApi.getAttemptAnswers(attemptData.id);
            setAnswers(answersData);
            setQuestions(
                answersData.map((ans) => ({
                    id: ans.questionId,
                    questionText: ans.questionText,
                    codeSnippet: ans.codeSnippet,
                    type: ans.type,
                    option1: ans.option1,
                    option2: ans.option2,
                    option3: ans.option3,
                    option4: ans.option4,
                    marks: ans.marks,
                }))
            );

            setLoading(false); // ← success path

        } catch (error) {
            // ── Stop spinner BEFORE showing modal ────────────────────────
            // If you use finally, loading stays true while modal is open
            // which makes the page look stuck behind the modal
            setLoading(false);

            const message =
                error.response?.data?.message ||
                (typeof error.response?.data === 'string' ? error.response.data : null) ||
                'Failed to start quiz';

            await showInfo(message, 'error');   // wait for user to click OK
            navigate('/student');               // then navigate away
        }
        // ← NO finally block — we call setLoading(false) manually in both paths
    };

    // ── Tab switch warning ────────────────────────────────────────────────────
    useEffect(() => {
        if (!attempt || attempt.status === 'COMPLETED') return;

        const handleVisibilityChange = async () => {
            if (!document.hidden) return;
            if (!attemptRef.current || attemptRef.current.status === 'COMPLETED') return;

            try {
                const { data: updated } = await studentApi.recordWarning(attemptRef.current.id);
                setWarningCount(updated.warningCount);
                if (updated.status === 'COMPLETED') setAutoSubmitted(true);
                setShowWarningModal(true);
            } catch (err) {
                console.error('Failed to record warning:', err);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [attempt]);

    // ── Answer selection ──────────────────────────────────────────────────────
    const handleAnswerSelect = async (optionNumber) => {
        const currentQuestion = questions[currentQuestionIndex];
        try {
            await studentApi.submitAnswer(attempt.id, {
                questionId: currentQuestion.id,
                selectedOption: optionNumber,
            });
            setAnswers((prev) =>
                prev.map((ans) =>
                    ans.questionId === currentQuestion.id
                        ? { ...ans, selectedOption: optionNumber, attempted: true }
                        : ans
                )
            );
        } catch {
            await showInfo('Failed to save answer. Please try again.', 'error');
        }
    };

    // ── Force submit (time up / auto) ─────────────────────────────────────────
    const forceSubmitQuiz = useCallback(async () => {
        if (!attemptRef.current) return;
        try {
            await studentApi.submitQuiz(attemptRef.current.id);
            await showInfo('Time is up! Your quiz has been submitted.', 'info');
            navigate('/student/results');
        } catch (err) {
            console.error('Failed to auto-submit:', err);
        }
    }, []);

    // ── Manual submit ─────────────────────────────────────────────────────────
    const submitQuiz = async () => {
        const confirmed = await showConfirm('Are you sure you want to submit your quiz?');
        if (!confirmed) return;

        try {
            await studentApi.submitQuiz(attempt.id);
            await showInfo('Quiz submitted successfully!', 'success');
            navigate('/student/results');
        } catch (error) {
            await showInfo(
                error.response?.data?.message ||
                (typeof error.response?.data === 'string' ? error.response.data : null) ||
                error.message ||
                'Failed to submit quiz.',
                'error'
            );
        }
    };

    // ── Dismiss warning modal ─────────────────────────────────────────────────
    const dismissWarning = () => {
        if (autoSubmitted) navigate('/student/results');
        else setShowWarningModal(false);
    };

    // ── Question status ───────────────────────────────────────────────────────
    const getQuestionStatus = (index) => {
        if (index === currentQuestionIndex) return 'current';
        const ans = answers.find((a) => a.questionId === questions[index]?.id);
        return ans?.attempted ? 'attempted' : 'not-attempted';
    };

    return {
        attempt,
        quizMeta,
        questions,
        answers,
        currentQuestionIndex,
        loading,
        warningCount,
        showWarningModal,
        autoSubmitted,
        infoModal,
        confirmModal,
        startedAt: attempt?.startTime ?? null,
        setCurrentQuestionIndex,
        handleAnswerSelect,
        handleTimeUp: forceSubmitQuiz,
        submitQuiz,
        dismissWarning,
        getQuestionStatus,
        MAX_WARNINGS,
    };
};