import React, { useEffect, useState } from 'react'
import { getRoleCount } from '../../services/AdminServices/RoleService';
import { toast } from 'react-toastify';
import { getCourseCount } from '../../services/AdminServices/DeptService';
import { getTeacherCount } from '../../services/AdminServices/TeacherService';
import { getNoticeCount } from '../../services/AdminServices/NoticeService';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const AdminDashboard = () => {
    const [roleCount, setRoleCount] = React.useState(0);
    const [deptCount, setDeptCount] = React.useState(0);
    const [teacherCount, setTeacherCount] = React.useState(0);
    const [noticeCount, setNoticeCount] = React.useState(0);
    const [barData, setBarData] = useState([
        { category: "User Types", value: 0 },
        { category: "Courses", value: 0 },
        { category: "Teachers", value: 0 },
        { category: "Notices", value: 0 }
    ]);

    // First useEffect - fetch and set barData
    useEffect(() => {
        document.title = "Admin";

        Promise.all([
            getRoleCount(),
            getCourseCount(),
            getTeacherCount(),
            getNoticeCount()
        ])
            .then(([role, course, teacher, notice]) => {
                const newBarData = [
                    { category: "User Types", value: role },
                    { category: "Courses", value: course },
                    { category: "Teachers", value: teacher },
                    { category: "Notices", value: notice }
                ];

                setRoleCount(role);
                setDeptCount(course);
                setTeacherCount(teacher);
                setNoticeCount(notice);
                setBarData(newBarData); // triggers next useEffect
            })
            .catch((error) => {
                console.error(error);
                toast.error("Error loading dashboard data.");
            });
    }, []);

    useEffect(() => {
        if (!barData || barData.length === 0) return;

        let root = am5.Root.new("chartdiv");
        let root1 = am5.Root.new("piediv");

        root.setThemes([am5themes_Animated.new(root)]);
        const barChart = root.container.children.push(
            am5xy.XYChart.new(root, {
                layout: root.verticalLayout,
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 20,
                paddingBottom: 20,
                panX: true,
                panY: true,
                wheelX: "panX",
                wheelY: "zoomX",
                pinchZoomX: true,
            })
        );

        const xAxis = barChart.xAxes.push(
            am5xy.CategoryAxis.new(root, {
                categoryField: "category",
                renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 30 }),
                tooltip: am5.Tooltip.new(root, {}),
            })
        );

        const yAxis = barChart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {}),
            })
        );

        const series = barChart.series.push(
            am5xy.ColumnSeries.new(root, {
                name: "Count",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "value",
                categoryXField: "category",
                tooltip: am5.Tooltip.new(root, { labelText: "{valueY}" }),
            })
        );

        // ✅ Ensure DOM is ready by wrapping in a minimal delay
        setTimeout(() => {
            console.log("Chart Data:", barData);
            xAxis.data.setAll(barData);
            series.data.setAll(barData);
            series.appear(10);
            barChart.appear(10, 100);
        }, 0);

        // Pie chart (works fine)
        root1.setThemes([am5themes_Animated.new(root1)]);
        const pieChart = root1.container.children.push(
            am5percent.PieChart.new(root1, { endAngle: 270 })
        );

        const pieSeries = pieChart.series.push(am5percent.PieSeries.new(root1, {
            valueField: "value",
            categoryField: "category",
            endAngle: 270,
            alignLabels: true
        }));

        // Show all labels with category and percentage
        pieSeries.labels.template.setAll({
            text: "{category}: {value}%",
            fontSize: 14,
            fill: am5.color(0x000000), // Optional: label color
            oversizedBehavior: "wrap"
        });

        pieSeries.slices.template.states.create("hover", { scale: 1.05 });
        pieSeries.data.setAll(barData);
        pieSeries.appear(100, 10);

        return () => {
            root.dispose();
            root1.dispose();
        };
    }, [barData]);



    return (
        <div className='dash'>
            <section>
                <div className="row">
                    <div className="col-xl-3 col-sm-6 col-12 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex justify-content-between px-md-1">
                                    <div>
                                        <h3 className="text-danger">{roleCount}</h3>
                                        <p className="mb-0">User Types</p>
                                    </div>
                                    <div className="align-self-center">
                                        <i className="bi bi-person-circle text-danger fs-1"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 col-12 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex justify-content-between px-md-1">
                                    <div>
                                        <h3 className="text-success">{deptCount}</h3>
                                        <p className="mb-0">Courses</p>
                                    </div>
                                    <div className="align-self-center">
                                        <i className="bi bi-book-fill text-success fs-1"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 col-12 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex justify-content-between px-md-1">
                                    <div>
                                        <h3 className="text-warning">{teacherCount}</h3>
                                        <p className="mb-0">Teachers</p>
                                    </div>
                                    <div className="align-self-center">
                                        <i className="bi bi-person-video3 text-warning fs-1"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 col-12 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex justify-content-between px-md-1">
                                    <div>
                                        <h3 className="text-info">{noticeCount}</h3>
                                        <p className="mb-0">Notices</p>
                                    </div>
                                    <div className="align-self-center">
                                        <i className="bi bi-pencil-fill text-info fs-1"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <section>
                    <div className="row">
                        <div className="col-md-6 col-sm-12 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="py-3">
                                        <div id="chartdiv" style={{ width: "100%", minHeight: "200px" }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-12 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="py-3">
                                        <div id="piediv" style={{ width: "100%", minHeight: "200px" }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>


        </div>
    )
}

export default AdminDashboard