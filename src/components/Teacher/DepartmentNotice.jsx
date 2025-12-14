import React, { useEffect } from 'react'
import { getNoticeByDepts, readNotice } from '../../services/AdminServices/NoticeService';
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import $ from "jquery";
import "datatables.net-bs5";
import timeAgo from '../Admin/timeAgo';
import { useNotice } from '../Header/NoticeContextComponent';

window.$ = window.jQuery = $;

const DepartmentNotice = () => {
  const { markAsRead } = useNotice();

  useEffect(() => {
    const deptId = sessionStorage.getItem("deptId");
    const table = $("#noticeList").DataTable({
      ajax: function (_, callback) {
        getNoticeByDepts(deptId).then((res) => {
          callback({ data: res }); // DataTables expects {data: []}
        });
      },
      searching: true,
      paging: true,
      ordering: false,
      destroy: true,
      dom:
        "<'row mb-3'<'col d-flex justify-content-end'f>>" +
        "<'row'<'col'tr>>" +
        "<'row mt-3'<'col-sm-5'i><'col-sm-7'p>>",

      columns: [{ data: null }],

      columnDefs: [
        {
          targets: 0,
          render: (data) => {
            console.log("data: " + JSON.stringify(data));
            return `
            <div class="notice-item d-flex align-items-center p-3 border-bottom" style="cursor:pointer;">
              <div class="me-3">
                <i class="bi bi-bell-fill fs-6 text-primary"></i>
              </div>

              <div class="flex-grow-1">
                <h6 class="mb-1 fw-semibold">${data.noticeTitle}</h6>
              </div>

              <div class="text-end text-muted small">${timeAgo(data.postedOn)}</div>
            </div>
          `;
          }
        },
      ],
    });

    // Expand/collapse child row
    $('#noticeList tbody').off('click').on('click', '.notice-item', function () {
      const tr = $(this).closest('tr');
      const row = table.row(tr);
      const data = row.data();
      const noticeId = data.id;
      const userId = sessionStorage.getItem("userId");
      const userRole = sessionStorage.getItem("userRole");
      readNotice(noticeId, userId, userRole).then(() => {
        markAsRead(noticeId); // 🔥 updates header count instantly
      });
      // Close any other open rows
      table.rows().every(function () {
        if (this.child.isShown() && this !== row) {
          this.child.hide();
          $(this.node()).removeClass('shown');
        }
      });

      // Toggle this row
      if (row.child.isShown()) {
        row.child.hide();
        tr.removeClass('shown');
      } else {
        row.child(`<div class="notice-desc p-3 border-bottom">${row.data().noticeDesc || 'No description'}</div>`).show();
        tr.addClass('shown');
      }
    });

    return () => table.destroy(false);
  }, []);

  return (
    <>
      <div className='row'>
        <div className='mx-auto col-12'>
          <div className="card mt-4 border-1 col-12">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap"></div>
            <div className="card-body">
              <table id="noticeList" className="display w-100">
                <thead>
                  <tr>
                    <th>Notices</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default DepartmentNotice