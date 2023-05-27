import { Image } from "antd";
import moment from "moment";
import { formatDate, randomDate } from "util/constant";

export const firstColumns = [
    //contacts' id, full name, gender, email, mobile, status
    {

        title: 'Loại sản phẩm',
        dataIndex: 'category',
        key: 'category',
    },
    {
        title: 'Tổng',
        dataIndex: 'total',
        key: 'total',
    },
];

export const secondColumns = [
    {

        title: 'Loại sản phẩm',
        dataIndex: 'category',
        key: 'category',
    },
    {
        title: 'Đánh giá',
        dataIndex: 'avgStar',
        key: 'avgStar',
    },
];

export const thridColumns = [
    //contacts' id, full name, gender, email, mobile, status
    {

        title: 'Ngày',
        dataIndex: 'date',
        key: 'date',
        // render: (text) => {
        //     return moment(text).format(formatDate)
        // }
    },
    {
        title: 'Thành công',
        dataIndex: 'success',
        key: 'success',

    },
    {
        title: 'Đợi xác nhận',
        dataIndex: 'submitted',
        key: 'submitted',
    },
    {
        title: 'Hủy',
        dataIndex: 'cancelled',
        key: 'cancelled',
    },
];
export const fourthColumns = [
    //contacts' id, full name, gender, email, mobile, status
    {

        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        // render: (text) => {
        //     return moment(text).format(formatDate)
        // }
    },
    {
        title: 'Tên',
        dataIndex: 'fullName',
        key: 'fullName',

    },
    {
        title: 'SĐT',
        dataIndex: 'phone',
        key: 'phone',
    },
];

export const fifthColumns = [
    //contacts' id, full name, gender, email, mobile, status
    {

        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        // render: (text) => {
        //     return moment(text).format(formatDate)
        // }
    },
    {
        title: 'Tên',
        dataIndex: 'fullName',
        key: 'fullName',

    },
    {
        title: 'SĐT',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: 'Ngày',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text) => {
            return moment(text).format(formatDate)
        }
    },
];

export const secondData = [
    //contacts' id, full name, gender, email, mobile, status
    {
        key: '1',
        orderId: '0324',
        status: 'Hủy',
    },
    {
        key: '2',
        orderId: '1273',
        status: 'Chờ xử lý',
    },
    {
        key: '3',
        orderId: '6236',
        status: 'Thành công',
    },
    {
        key: '4',
        orderId: '1256',
        status: 'Thành công',
    },
    {
        key: '6',
        orderId: '9655',
        status: 'Thành công',
    },
    {
        key: '7',
        orderId: '6854',
        status: 'Thành công',
    },
    {
        key: '8',
        orderId: '4563',
        status: 'Thành công',
    },
    {
        key: '9',
        orderId: '7575',
        status: 'Thành công',
    },
    {
        key: '10',
        orderId: '7426',
        status: 'Chờ xử lý',
    },
    {
        key: '11',
        orderId: '1230',
        status: 'Hủy',
    },
];

export const firstData = [
    //contacts' id, full name, gender, email, mobile, status
    {
        key: '1',
        orderId: '0324',
        shippedDate: randomDate(new Date(2022, 0, 1), new Date())
    },
    {
        key: '2',
        orderId: '3633',
        shippedDate: randomDate(new Date(2022, 0, 1), new Date())
    },
    {
        key: '3',
        orderId: '1245',
        shippedDate: randomDate(new Date(2022, 0, 1), new Date())
    },
    {
        key: '4',
        orderId: '3351',
        shippedDate: randomDate(new Date(2022, 0, 1), new Date())
    },
    {
        key: '5',
        orderId: '6345',
        shippedDate: randomDate(new Date(2022, 0, 1), new Date())
    },
];

export const thridData = [
    //contacts' id, full name, gender, email, mobile, status
    {
        key: '1',
        orderId: '0324',
        shippedDate: randomDate(new Date(2022, 0, 1), new Date()),
        amount: Math.round(Math.random(0, 1) * 10000000)
    },
    {
        key: '2',
        orderId: '3633',
        shippedDate: randomDate(new Date(2022, 0, 1), new Date()),
        amount: Math.round(Math.random(0, 1) * 10000000)
    },
    {
        key: '3',
        orderId: '1245',
        shippedDate: randomDate(new Date(2022, 0, 1), new Date()),
        amount: Math.round(Math.random(0, 1) * 10000000)
    },
    {
        key: '4',
        orderId: '3351',
        shippedDate: randomDate(new Date(2022, 0, 1), new Date()),
        amount: Math.round(Math.random(0, 1) * 10000000)
    },
    {
        key: '5',
        orderId: '6345',
        shippedDate: randomDate(new Date(2022, 0, 1), new Date()),
        amount: Math.round(Math.random(0, 1) * 10000000)
    },
];


export const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];