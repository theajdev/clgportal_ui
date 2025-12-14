import { createContext, useContext, useState } from "react";
import { getNoticeByDepts, getNoticeReadDetails } from "../../services/AdminServices/NoticeService";

const NoticeContext = createContext(null);

export const useNotice = () => {
    const context = useContext(NoticeContext);
    if (!context) {
        throw new Error("useNotice must be used within NoticeContextComponent");
    }
    return context;
};

const NoticeContextComponent = ({ children }) => {

    const [notices, setNotices] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    /**
  * 🔥 Load department notices ONCE
  */
    const loadDeptNotices = async (deptId) => {
        if (!deptId || loading) return;

        try {
            setLoading(true);

            const userId = sessionStorage.getItem("userId");
            const userRole = sessionStorage.getItem("userRole"); // STUDENT / TEACHER

            const deptNotices = await getNoticeByDepts(deptId);
            const filteredNotices = [];

            for (const notice of deptNotices) {
                const readDetails = await getNoticeReadDetails(notice.id);

                const alreadyRead = readDetails.some(detail => {
                    if (userRole === "STUDENT") {
                        return detail.studentId?.toString() === userId?.toString();
                    }

                    if (userRole === "TEACHER") {
                        return detail.teacherId?.toString() === userId?.toString();
                    }

                    return false;
                });

                // ❌ Skip read notice
                if (alreadyRead) continue;

                // ✅ Keep unread
                filteredNotices.push({
                    ...notice,
                    isRead: false
                });
            }

            console.log("Filtered Notices:", filteredNotices);

            setNotices(filteredNotices);
            setUnreadCount(filteredNotices.length);

        } catch (err) {
            console.error("Error loading dept notices", err);
        } finally {
            setLoading(false);
        }
    };


    const markAsRead = (noticeId) => {
        setNotices(prev => {
            const notice = prev.find(n => n.id === noticeId);

            // 🔒 Already read → do nothing
            if (!notice || notice.isRead) {
                return prev;
            }

            // ✅ Mark as read
            setUnreadCount(c => Math.max(c - 1, 0));

            return prev.map(n =>
                n.id === noticeId ? { ...n, isRead: true } : n
            );
        });
    };

    return (
        <NoticeContext.Provider
            value={{
                notices,
                setNotices,
                unreadCount,
                setUnreadCount,
                markAsRead,
                loadDeptNotices,
            }}
        >
            {children}
        </NoticeContext.Provider>
    );
};

export default NoticeContextComponent;