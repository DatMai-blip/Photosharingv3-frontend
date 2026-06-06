/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the request.
 * @param {object} options  Optional parameters: { method, body }
 * @returns {Promise}
 */
function fetchModel(url, options = {}) {
  const baseUrl = "https://mdr8k8-8081.csb.app";

  // Mặc định nếu không truyền method thì sẽ là "GET"
  const method = options.method || "GET";
  // Nếu có body thì chuyển thành chuỗi JSON string để gửi lên server
  const body = options.body ? JSON.stringify(options.body) : null;

  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, baseUrl + url);

    // CẤU HÌNH QUAN TRỌNG 1: Nếu gửi dữ liệu POST, phải set header báo cho Backend biết là JSON
    if (method === "POST") {
      xhr.setRequestHeader("Content-Type", "application/json");
    }

    // Tự động bốc JWT Token từ localStorage (nếu có) để đính vào Header
    const token = localStorage.getItem("token");
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    xhr.onreadystatechange = function () {
      // readyState 4 nghĩa là request đã hoàn thành
      if (xhr.readyState !== 4) return;

      if (xhr.status === 200) {
        // Thành công: parse JSON và resolve
        try {
          resolve({ data: JSON.parse(xhr.responseText) });
        } catch (e) {
          // Trường hợp server trả về chuỗi text thuần thay vì object JSON
          resolve({ data: xhr.responseText });
        }
      } else {
        // Thất bại (400, 401, 404, 500...): reject kèm theo status và thông báo từ server
        reject({
          status: xhr.status,
          statusText: xhr.statusText,
          error: xhr.responseText,
        });
      }
    };

    xhr.send(body);
  });
}

export default fetchModel;
