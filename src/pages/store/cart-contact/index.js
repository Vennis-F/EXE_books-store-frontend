import {
  Button,
  Col,
  Divider,
  Row,
  Typography,
  Select,
  Form,
  Input,
  message,
  Radio,
  Space,
} from 'antd';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import {
  InfoCircleOutlined,
  QuestionOutlined,
  ArrowLeftOutlined,
  MoneyCollectOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import './styles.less';
import StoreLayoutContainer from 'layouts/store/store.layout';
import WrapperConentContainer from 'layouts/store/wrapper.content';
import { useNavigate } from 'react-router-dom';
import {
  createOrder,
  createOrderGuest,
  getCartItemList,
  getCartItemListGuest,
  getReceiverInfor,
  getReceiverInforGuest,
  setReceiverInforSession,
} from './service';
import axiosClient from 'util/axiosClient';
import { MoneyFormat } from 'components/format';
import { QRCodeSVG } from 'qrcode.react';
import QRimg from '../../../assets/QR_Loc.svg';
const { Option } = Select;

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 6,
    span: 18,
  },
};
const validateMessages = {
  required: 'Nhập ${label}!',
  types: {
    email: '${label} không hợp lệ!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};

const CartContact = () => {
  // State
  const [updated, setUpdated] = useState(true);
  const [receiver, setReceiver] = useState({});
  const [inforDefault, setInforDefault] = useState({});
  const [cart, setCart] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [randomOrderIdMomo, setRandRomOrderIdMomo] = useState(
    getRandomInt(10000, 99999)
  );

  // Hook
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Method
  const onFinish = (values) => {
    if (updated) {
      setUpdated(false);
    } else {
      // set session receiver information:
      setReceiverInforSession(values)
        .then((result) => {
          // Set state and form
          form.setFieldsValue(values);
          setUpdated(true);
          // setReceiver(values);
        })
        .catch((error) => {
          message.error(`${error.response.data.error}`);
        });
    }
  };
  const onReset = () => form.setFieldsValue(inforDefault);
  const onClickConfirm = async () => {
    try {
      if (localStorage.getItem('__role') === 'R02') {
        // Create order
        const order = await createOrderGuest();
        message.loading('Đang kiểm tra...', 1.5);

        // Empty alot
        await axiosClient.patch('/checkout/confirm/guest');
        setTimeout(() => message.success('Đặt hàng thành công', 2.5), 1800);

        //naviage
        setTimeout(() => {
          navigate(`/cart-completion/${order._id}`);
        }, 2500);
      } else {
        // Create order
        const order = await createOrder({
          noteMoMo: `${receiver.fullName} - Chuyển tiền order ${randomOrderIdMomo}  - ${receiver.phone}`,
        });
        message.loading('Đang kiểm tra...', 1.5);

        // Empty a lot
        await axiosClient.patch('/checkout/confirm');
        setTimeout(() => message.success('Đặt hàng thành công', 2.5), 1800);

        //naviage
        setTimeout(() => {
          navigate(`/cart-completion/${order._id}`);
        }, 2500);
      }
    } catch (error) {
      // Dù lỗi gì thì redirect car-contact
      navigate('/cart');

      // Anounce error message
      console.log(error.reponse);
      const dataError = error.response.data.error;
      const msgError = Array.isArray(dataError)
        ? dataError.map((error) => (
            <div>
              {error} <br />
            </div>
          ))
        : dataError;

      message.error(msgError, 5);
      setCart(cart);
    }
  };
  const changePaymentMethod = (e) => {
    if (e.target.value === 'momo' && !receiver) {
      message.error('Xin hãy nhập Thông tin nhận hàng trước');
      return;
    }
    setPaymentMethod(e.target.value);
  };

  // useEffect
  useEffect(() => {
    if (!localStorage.getItem('__token') && !localStorage.getItem('__role')) {
      console.log('not have jwt store in localStorage');
      axiosClient.post('/user/guest').then((result) => {
        localStorage.setItem('__role', result.guest.role.code);
      });
    }

    //Guest or Customer
    if (localStorage.getItem('__role') === 'R02') {
      // onFill();
      getReceiverInforGuest()
        .then((result) => {
          // Set state for receiver information
          if (Object.keys(result).length === 0) setUpdated(false);
          setReceiver(result);
          setInforDefault(result);
          form.setFieldsValue(result);

          // Set state for cart item
          getCartItemListGuest()
            .then((result) => {
              setCart(result);
            })
            .catch((error) => {
              console.log(error.response);
            });
        })
        .catch((error) => console.log(error));
    } else {
      // onFill();
      getReceiverInfor()
        .then((result) => {
          // Set state for receiver information
          setInforDefault(result);
          form.setFieldsValue(result);
          setReceiver(result);

          // Set state for cart item
          getCartItemList()
            .then((result) => {
              setCart(result);
            })
            .catch((error) => {
              console.log(error.response);
            });
        })
        .catch((error) => console.log(error));
    }
  }, []);

  const inforPaymentPaypal = () => {
    let totalCost = 0;
    const itemsPayment = cart.items.map((cartItem) => {
      const value =
        Math.round((cartItem.product.salePrice / 23000) * 100) / 100;
      totalCost += value * cartItem.quantity;
      return {
        name: cartItem.product.title,
        unit_amount: {
          currency_code: 'USD',
          value,
        },
        quantity: cartItem.quantity,
      };
    });
    totalCost = Math.round(totalCost * 100) / 100;
    return {
      purchase_units: [
        {
          amount: {
            value: totalCost,
            breakdown: {
              item_total: {
                value: totalCost,
                currency_code: 'USD',
              },
            },
          },
          items: itemsPayment,
          description: `${receiver.fullName} - Payment for books - ${receiver.phone}`,
        },
      ],
    };
  };

  return (
    <>
      <WrapperConentContainer>
        <div className="contact-infor">
          <h2
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '22px',
            }}
          >
            <InfoCircleOutlined
              style={{
                fontSize: '28px',
                marginRight: '5px',
                color: 'red',
              }}
            />
            Thông tin nhận hàng
          </h2>
          <Divider style={{ margin: '18px 0' }} />
          <Row className="form-contact-container" justify="space-evenly">
            <Col span={14}>
              <Form
                // onValuesChange={onChange}
                size="middle"
                {...layout}
                form={form}
                name="control-hooks"
                validateMessages={validateMessages}
                onFinish={onFinish}
              >
                <Form.Item
                  // hidden={true}
                  name="fullName"
                  label="Họ và tên"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input disabled={updated} />
                </Form.Item>
                <Form.Item
                  name="gender"
                  label="Giới tính"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn giới tính"
                    allowClear
                    disabled={updated}
                  >
                    <Option value="M">male</Option>
                    <Option value="F">female</Option>
                    <Option value="D">other</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: 'true',
                      type: 'email',
                    },
                  ]}
                >
                  <Input disabled={updated} />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    {
                      required: 'true',
                    },
                  ]}
                >
                  <Input disabled={updated} />
                </Form.Item>
                <Form.Item
                  name="address"
                  label="Địa chỉ"
                  rules={[
                    {
                      required: 'true',
                    },
                  ]}
                >
                  <Input disabled={updated} />
                </Form.Item>
                <Form.Item name="note" label="Ghi chú">
                  <Input disabled={updated} />
                </Form.Item>
                <Form.Item {...tailLayout}>
                  <Button type="primary" htmlType="submit">
                    {updated ? 'Cập nhật' : 'Lưu lại'}
                  </Button>
                  <Button
                    type="link"
                    disabled={updated}
                    htmlType="button"
                    onClick={onReset}
                  >
                    Đặt lại
                  </Button>
                </Form.Item>
                {/* <Button htmlType="button" onClick={onReset}>
                  Reset
                </Button> */}
                {/* <Button onClick={onUpdate}>Cập nhật</Button> */}
              </Form>
            </Col>
          </Row>
        </div>
      </WrapperConentContainer>
      <WrapperConentContainer>
        <Row style={{ backgroundColor: 'white', padding: '10px' }}>
          <Col span={24}>
            <Row>
              <Col span={24}></Col>
              <h2
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '22px',
                }}
              >
                <QuestionOutlined
                  style={{
                    fontSize: '28px',
                    marginRight: '5px',
                    color: 'red',
                  }}
                />
                Kiểm tra lại đơn hàng
              </h2>
            </Row>
            <Divider style={{ margin: '18px 0' }} />
            {cart.items?.map((item) => (
              <div className="cart-value">
                <Row
                  className="cart-form"
                  style={{ width: '100%' }}
                  align="middle"
                >
                  <Col span={2} className="cart-detail-container">
                    <img className="cart-img" src={item.product.thumbnail} />
                  </Col>
                  <Col span={10}>
                    <Typography.Text
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        navigate(`/product-detail/${item.product._id}`)
                      }
                      ellipsis={true}
                      className="cart-title"
                    >
                      {item.title}
                    </Typography.Text>
                    <p className="cart-pushlisher">
                      {item.product.briefInformation.publisher}
                    </p>
                    <p className="cart-price">
                      <MoneyFormat>{item.amount}</MoneyFormat>
                    </p>
                  </Col>
                  <Col
                    style={{ textAlign: 'center', fontSize: '27px' }}
                    span={4}
                    offset={1}
                  >
                    {item.quantity}
                  </Col>
                  <Col
                    className="cart-productitem-saleprice"
                    style={{ textAlign: 'center' }}
                    span={4}
                    offset={1}
                  >
                    <MoneyFormat>{item.totalAmount}</MoneyFormat>
                  </Col>
                </Row>
              </div>
            ))}
          </Col>
        </Row>
      </WrapperConentContainer>
      <WrapperConentContainer>
        <Row style={{ backgroundColor: 'white', padding: '10px' }}>
          <Col span={24}>
            <Row>
              <Col span={24}></Col>
              <h2
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '22px',
                }}
              >
                <MoneyCollectOutlined
                  style={{
                    fontSize: '28px',
                    marginRight: '5px',
                    color: 'red',
                  }}
                />
                Phương thức thanh toán
              </h2>
            </Row>
            <Divider style={{ margin: '18px 0' }} />
            <Radio.Group
              direction="vertial"
              onChange={changePaymentMethod}
              value={paymentMethod}
            >
              <Space direction="vertical">
                <Radio value={'cash'}>
                  <div className="cart-value">
                    <Row className="cart-form" style={{ width: '100%' }}>
                      Thanh toán bằng tiền mặt khi nhận hàng
                    </Row>
                  </div>
                </Radio>
                <Radio value={'paypal'}>
                  <div className="cart-value">
                    <Row
                      className="cart-form"
                      style={{ width: '100%' }}
                      align="middle"
                    >
                      Thanh toán bằng Paypal
                    </Row>
                  </div>
                </Radio>
                {localStorage.getItem('__role') === 'R01' && (
                  <Radio value={'momo'}>
                    <div className="cart-value">
                      <Row
                        className="cart-form"
                        style={{ width: '100%' }}
                        align="middle"
                      >
                        Thanh toán bằng Momo
                      </Row>
                    </div>
                    {paymentMethod === 'momo' && (
                      <div className="cart-value">
                        <Row
                          className="cart-form"
                          style={{ width: '100%' }}
                          align="middle"
                        >
                          <img
                            src={QRimg}
                            alt="logo"
                            style={{ height: 200 }}
                            className="logo"
                          />
                        </Row>
                        <Row
                          className="cart-form"
                          style={{ width: '100%' }}
                          align="middle"
                        >
                          <p>
                            <span style={{ fontWeight: 'bold' }}>
                              Nội dung chuyển tiền:
                            </span>
                            {` ${receiver.fullName} - Chuyển tiền order ${randomOrderIdMomo} - ${receiver.phone}`}
                          </p>
                        </Row>
                        <Row
                          className="cart-form"
                          style={{ width: '100%' }}
                          align="middle"
                        >
                          <p>
                            <span style={{ fontWeight: 'bold' }}>Số tiền:</span>
                            {` ${cart.totalCost}`}
                          </p>
                        </Row>
                      </div>
                    )}
                  </Radio>
                )}
              </Space>
            </Radio.Group>
          </Col>
        </Row>
      </WrapperConentContainer>
      <WrapperConentContainer>
        <Row
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
          }}
        >
          <Col span={8} offset={16}>
            <div className="cart-money">
              <div className="cart-cost">
                <p>Tổng tiền</p>
                <p
                  className="total-price"
                  style={{ fontSize: '16px', fontWeight: '600' }}
                >
                  <MoneyFormat>{cart.totalCost}</MoneyFormat>
                </p>
              </div>
              <div className="cart-cost">
                <p>Tiền ship</p>
                <p
                  className="total-price"
                  style={{ fontSize: '16px', fontWeight: '600' }}
                >
                  {0} đ
                </p>
              </div>
              <div className="cart-cost">
                <p>Thành tiền</p>
                <p className="total-price">
                  <MoneyFormat>{cart.totalCost}</MoneyFormat>
                </p>
              </div>
            </div>
          </Col>
          <Divider style={{ margin: '5px 0 5px 0' }} />
          <Col span={8}>
            <Button type="link" size="large" onClick={() => navigate('/cart')}>
              <ArrowLeftOutlined />
              Trở về giỏ hàng
            </Button>
          </Col>
          <Col span={8} offset={8}>
            {paymentMethod !== 'paypal' ? (
              <div className="cart-money">
                <button onClick={onClickConfirm} style={{ color: 'white' }}>
                  Xác nhận thanh toán
                </button>
              </div>
            ) : (
              <div className="cart-value">
                <Row
                  className="cart-form"
                  style={{ width: '100%' }}
                  align="middle"
                >
                  <PayPalScriptProvider
                    options={{
                      'client-id':
                        'ASQys9b85ah0CzIqR_bO90qBvlg8N48-uzvUYt6IViPTawAcfOlBcJ3bMNyZjp6Zs2tSpvaTTbjQTp-Y',
                    }}
                  >
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create(inforPaymentPaypal());
                      }}
                      onApprove={(data, actions) => {
                        return actions.order.capture().then((details) => {
                          console.log('[Payment Capture] ', details);
                          message.success('Thanh toán thành công', 1);
                          onClickConfirm();
                        });
                      }}
                    />
                  </PayPalScriptProvider>
                </Row>
              </div>
            )}
          </Col>
        </Row>
      </WrapperConentContainer>
    </>
  );
};

export default CartContact;
