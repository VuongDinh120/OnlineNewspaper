//Xóa hiển thị lỗi
function ClearError(errMsg, input) {
    input.classList.remove('border-danger')
    document.getElementById(errMsg).innerHTML = '';
}
//kiểm tra input trước khi submit
function Validate_Submit_EditNews() {
    let isValid = true;
    let a = document.getElementsByTagName("small");
    for (i = 0; i < a.length; i++) {
        a[i].innerHTML = "";
      }
    const title = document.getElementById('txtTitle'),
        tinyDes = document.getElementById('txtTinyDes'),
        fullDes = tinymce.get("txtFullDes").getContent(),
        img = document.getElementsByTagName('img'),
        tag = document.getElementsByClassName('tag');
    // console.log(title);
    // console.log(tinyDes);
    // console.log(tag);
    console.log(img);
    if (title.value == '') {
        title.classList.add("border-danger");
        document.getElementById('err_Title').innerHTML = 'Tiêu đề không được trống';
        title.scrollIntoView();
        isValid = false;
    }
    if (tag.length <= 1) {
        document.getElementById('err_Tag').innerHTML = 'Phải có ít nhất 2 nhãn tag';
        document.getElementById('err_Tag').scrollIntoView();
        isValid = false;
    }
    if (tinyDes.value == '') {
        tinyDes.classList.add("border-danger");
        document.getElementById('err_TinyDes').innerHTML = 'Nội dung tóm tắt không được trống';
        tinyDes.scrollIntoView();
        isValid = false;
    }
    if (fullDes == '') {
        document.getElementById('err_FullDes').innerHTML = 'Nội dung bài báo không được trống';
        document.getElementById('err_FullDes').scrollIntoView();
        isValid = false;
    }
    if (fullDes.length <=1500) {
        document.getElementById('err_FullDes').innerHTML = 'Phải có ít nhất 500 từ';
        document.getElementById('err_FullDes').scrollIntoView();
        isValid = false;
    }

    if (img.length == 1) {
        // title.classList.add("border-danger");
        document.getElementById('err_IMG').innerHTML = 'Thiếu ảnh bìa bài báo';
        document.getElementById('err_IMG').scrollIntoView();
        isValid = false;
    }
   
    if (isValid == true)
        document.getElementById("frmEditNews").submit();
}

// function Validate_Submit_Register() {
//     var isValid = true;
//     const username = document.getElementById('username');
//     const password = document.getElementById('txtpwd');
//     const password2 = document.getElementById('txtpwd2');
//     const fullname = document.getElementById('fullname');
//     const phone = document.getElementById('phone');
//     const email = document.getElementById('email');


//     if (username.value == '') {
//         username.classList.add("border-danger");
//         document.getElementById('err_username').innerHTML = 'Tên tài khoản không được trống';
//         isValid = false;
//     }

//     if (password.value == '') {
//         password.classList.add("border-danger");
//         document.getElementById('err_password').innerHTML = 'Mật khẩu không được trống';
//         isValid = false;
//     } else if (password.value.length < 6) {
//         password.classList.add("border-danger");
//         document.getElementById('err_password').innerHTML = 'Mật khẩu phải có ít nhất 6 kí tự';
//         isValid = false;
//     }

//     if (password2.value == '') {
//         password2.classList.add("border-danger");
//         document.getElementById('err_password2').innerHTML = 'Xác nhận mật khẩu không được trống';
//         isValid = false;
//     } else if (password2.value != password.value) {
//         password2.classList.add("border-danger");
//         document.getElementById('err_password2').innerHTML = 'Mật khẩu không khớp';
//         isValid = false;
//     }

//     if (fullname.value == '') {
//         fullname.classList.add("border-danger");
//         document.getElementById('err_fullname').innerHTML = 'Họ tên không được trống';
//         isValid = false;
//     }

//     if (phone.value == '') {
//         phone.classList.add("border-danger");
//         document.getElementById('err_phone').innerHTML = 'Số điện thoại không được trống';
//         isValid = false;
//     }

//     if (email.value == '') {
//         email.classList.add("border-danger");
//         document.getElementById('err_email').innerHTML = 'Email không được trống';
//         isValid = false;
//     }

//     console.log(isValid);
//     if (isValid == true)
//         document.getElementById("registerForm").submit();
// }