-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 17, 2020 lúc 03:52 PM
-- Phiên bản máy phục vụ: 10.1.37-MariaDB
-- Phiên bản PHP: 7.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `newspapermanagerdb`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `baiviet`
--

CREATE TABLE `baiviet` (
  `ID` int(11) NOT NULL,
  `TieuDe` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `TomTat` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `NoiDung` text COLLATE utf8_unicode_ci NOT NULL,
  `isPremium` tinyint(1) DEFAULT NULL,
  `NgayDang` datetime DEFAULT NULL,
  `AnhDaiDien` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `TrangThai` int(11) NOT NULL,
  `NguoiViet` int(11) NOT NULL,
  `TheTag_ID` int(11) NOT NULL,
  `DanhMuc_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `binhluan`
--

CREATE TABLE `binhluan` (
  `BaiViet_ID` int(11) NOT NULL,
  `TaiKhoan_ID` int(11) NOT NULL,
  `NoiDung` text COLLATE utf8_unicode_ci NOT NULL,
  `NgayBinhLuan` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danhmuc`
--

CREATE TABLE `danhmuc` (
  `ID` int(11) NOT NULL,
  `TenDanhMuc` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `DanhMucCha` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ganthebaiviet`
--

CREATE TABLE `ganthebaiviet` (
  `BaiViet_ID` int(11) NOT NULL,
  `Tag_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phancong`
--

CREATE TABLE `phancong` (
  `TaiKhoan_ID` int(11) NOT NULL,
  `DanhMuc_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `roles`
--

CREATE TABLE `roles` (
  `ID` int(11) NOT NULL,
  `RoleName` varchar(100) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tag`
--

CREATE TABLE `tag` (
  `ID` int(11) NOT NULL,
  `TenTag` varchar(100) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taikhoan`
--

CREATE TABLE `taikhoan` (
  `ID` int(11) NOT NULL,
  `TenDangNhap` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `HoTen` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `Email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `ButDanh` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `MatKhau` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `ResetPasswordToken` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ResetPasswordExpireTime` datetime DEFAULT NULL,
  `PremiumExpireTime` datetime DEFAULT NULL,
  `Role_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tinhtrangbaiviet`
--

CREATE TABLE `tinhtrangbaiviet` (
  `ID` int(11) NOT NULL,
  `TenTinhTrang` varchar(100) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `baiviet`
--
ALTER TABLE `baiviet`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `TrangThai` (`TrangThai`),
  ADD KEY `DanhMuc_ID` (`DanhMuc_ID`),
  ADD KEY `NguoiViet` (`NguoiViet`);

--
-- Chỉ mục cho bảng `binhluan`
--
ALTER TABLE `binhluan`
  ADD PRIMARY KEY (`BaiViet_ID`,`TaiKhoan_ID`),
  ADD KEY `TaiKhoan_ID` (`TaiKhoan_ID`);

--
-- Chỉ mục cho bảng `danhmuc`
--
ALTER TABLE `danhmuc`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `DanhMucCha` (`DanhMucCha`);

--
-- Chỉ mục cho bảng `ganthebaiviet`
--
ALTER TABLE `ganthebaiviet`
  ADD PRIMARY KEY (`Tag_ID`),
  ADD KEY `BaiViet_ID` (`BaiViet_ID`);

--
-- Chỉ mục cho bảng `phancong`
--
ALTER TABLE `phancong`
  ADD PRIMARY KEY (`TaiKhoan_ID`,`DanhMuc_ID`),
  ADD KEY `DanhMuc_ID` (`DanhMuc_ID`);

--
-- Chỉ mục cho bảng `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`ID`);

--
-- Chỉ mục cho bảng `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`ID`);

--
-- Chỉ mục cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `TenDangNhap` (`TenDangNhap`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD UNIQUE KEY `ButDanh` (`ButDanh`),
  ADD KEY `Role_ID` (`Role_ID`);

--
-- Chỉ mục cho bảng `tinhtrangbaiviet`
--
ALTER TABLE `tinhtrangbaiviet`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `baiviet`
--
ALTER TABLE `baiviet`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `danhmuc`
--
ALTER TABLE `danhmuc`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `roles`
--
ALTER TABLE `roles`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tag`
--
ALTER TABLE `tag`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tinhtrangbaiviet`
--
ALTER TABLE `tinhtrangbaiviet`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `baiviet`
--
ALTER TABLE `baiviet`
  ADD CONSTRAINT `baiviet_ibfk_1` FOREIGN KEY (`TrangThai`) REFERENCES `tinhtrangbaiviet` (`ID`),
  ADD CONSTRAINT `baiviet_ibfk_2` FOREIGN KEY (`DanhMuc_ID`) REFERENCES `danhmuc` (`ID`),
  ADD CONSTRAINT `baiviet_ibfk_3` FOREIGN KEY (`NguoiViet`) REFERENCES `taikhoan` (`ID`);

--
-- Các ràng buộc cho bảng `binhluan`
--
ALTER TABLE `binhluan`
  ADD CONSTRAINT `binhluan_ibfk_1` FOREIGN KEY (`BaiViet_ID`) REFERENCES `baiviet` (`ID`),
  ADD CONSTRAINT `binhluan_ibfk_2` FOREIGN KEY (`TaiKhoan_ID`) REFERENCES `taikhoan` (`ID`);

--
-- Các ràng buộc cho bảng `danhmuc`
--
ALTER TABLE `danhmuc`
  ADD CONSTRAINT `danhmuc_ibfk_1` FOREIGN KEY (`DanhMucCha`) REFERENCES `danhmuc` (`ID`);

--
-- Các ràng buộc cho bảng `ganthebaiviet`
--
ALTER TABLE `ganthebaiviet`
  ADD CONSTRAINT `ganthebaiviet_ibfk_1` FOREIGN KEY (`BaiViet_ID`) REFERENCES `baiviet` (`ID`),
  ADD CONSTRAINT `ganthebaiviet_ibfk_2` FOREIGN KEY (`Tag_ID`) REFERENCES `tag` (`ID`);

--
-- Các ràng buộc cho bảng `phancong`
--
ALTER TABLE `phancong`
  ADD CONSTRAINT `phancong_ibfk_1` FOREIGN KEY (`DanhMuc_ID`) REFERENCES `danhmuc` (`ID`),
  ADD CONSTRAINT `phancong_ibfk_2` FOREIGN KEY (`TaiKhoan_ID`) REFERENCES `taikhoan` (`ID`);

--
-- Các ràng buộc cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD CONSTRAINT `taikhoan_ibfk_1` FOREIGN KEY (`Role_ID`) REFERENCES `roles` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
