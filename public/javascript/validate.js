//Xóa hiển thị lỗi
function ClearError(errMsg, input) {
    input.classList.remove('border-danger')
    document.getElementById(errMsg).innerHTML = '';
}
//kiểm tra input trước khi submit
function Validate_Submit_EditNews() {
    var check = true;
    const title = document.getElementById('txtTitle'),
        tinyDes = document.getElementById('txtTinyDes'),
        fullDes = document.getElementById('txtFullDes'),
        img = document.getElementById('fuNews'),
        tag = document.getElementsByClassName('tag');

    if (title.value == '') {
        title.classList.add("border-danger");
        document.getElementById('err_Title').innerHTML = 'Tiêu đề không được trống';
        check = false;
    }
    if (tag.length <= 1) {
        document.getElementById('err_Tag').innerHTML = 'Phải có ít nhất 2 nhãn tag';
        check = false;
    }
    if (tinyDes.value == '') {
        tinyDes.classList.add("border-danger");
        document.getElementById('err_TinyDes').innerHTML = 'Nội dung tóm tắt không được trống';
        check = false;
    }
    if (fullDes.value == '') {
        fullDes.classList.add("border-danger");
        document.getElementById('err_FullDes').innerHTML = 'Nội dung bài báo không được trống';
        check = false;
    }
    if (img.value == undefined) {
        // title.classList.add("border-danger");
        document.getElementById('err_IMG').innerHTML = 'Thiếu ảnh bìa bài báo';
        check = false;
    }
    console.log(check);
    if (check == true)
        document.getElementById("frmEditNews").submit();
}

function Validate_Submit_Register() {
    var check = true;
    const username = document.getElementById('username');
    const password = document.getElementById('txtpwd');
    const password2 = document.getElementById('txtpwd2');
    const fullname = document.getElementById('fullname');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');


    if (username.value == '') {
        username.classList.add("border-danger");
        document.getElementById('err_username').innerHTML = 'Tên tài khoản không được trống';
        check = false;
    }

    if (password.value == '') {
        password.classList.add("border-danger");
        document.getElementById('err_password').innerHTML = 'Mật khẩu không được trống';
        check = false;
    } else if (password.value.length < 6) {
        password.classList.add("border-danger");
        document.getElementById('err_password').innerHTML = 'Mật khẩu phải có ít nhất 6 kí tự';
        check = false;
    }

    if (password2.value == '') {
        password2.classList.add("border-danger");
        document.getElementById('err_password2').innerHTML = 'Xác nhận mật khẩu không được trống';
        check = false;
    } else if (password2.value != password.value) {
        password2.classList.add("border-danger");
        document.getElementById('err_password2').innerHTML = 'Mật khẩu không khớp';
        check = false;
    }

    if (fullname.value == '') {
        fullname.classList.add("border-danger");
        document.getElementById('err_fullname').innerHTML = 'Họ tên không được trống';
        check = false;
    }

    if (phone.value == '') {
        phone.classList.add("border-danger");
        document.getElementById('err_phone').innerHTML = 'Số điện thoại không được trống';
        check = false;
    }

    if (email.value == '') {
        email.classList.add("border-danger");
        document.getElementById('err_email').innerHTML = 'Email không được trống';
        check = false;
    }

    console.log(check);
    if (check == true)
        document.getElementById("registerForm").submit();
}