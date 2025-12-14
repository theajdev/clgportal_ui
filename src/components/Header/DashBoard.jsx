import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useNotice } from "./NoticeContextComponent";
import { Outlet } from "react-router-dom";
import Footer from "../Footer";

const DashBoard = () => {
    const { loadDeptNotices } = useNotice();
    useEffect(() => {
        const deptId = sessionStorage.getItem("deptId");

        if (deptId) {
            loadDeptNotices(deptId);
        }
    }, []);

    return (
        <>
            <Header />

        </>
    );
};

export default DashBoard;
