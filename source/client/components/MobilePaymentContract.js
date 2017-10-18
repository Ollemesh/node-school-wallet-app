import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import axios from 'axios';

import {Island, Title, Button, Input} from './';

const MobilePaymentLayout = styled(Island)`
	width: 440px;
	background: #108051;
`;

const MobilePaymentTitle = styled(Title)`
	color: #fff;
`;

const InputField = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 26px;
	position: relative;
	padding-left: 150px;
`;

const Label = styled.div`
	font-size: 15px;
	color: #fff;
	position: absolute;
	left: 0;
`;

const Currency = styled.span`
	font-size: 13px;
	color: #fff;
	margin-left: 12px;
`;

const Commission = styled.div`
	color: rgba(255, 255, 255, 0.6);
	font-size: 13px;
	text-align: right;
	margin: 35px 0 20px;
`;

const Underline = styled.div`
	height: 1px;
	margin-bottom: 20px;
	background-color: rgba(0, 0, 0, 0.16);
`;

const PaymentButton = styled(Button)`
	float: right;
`;

const InputPhoneNumber = styled(Input)`
	width: 225px;
`;

const InputSum = styled(Input)`
	width: 160px;
`;

const InputCommision = styled(Input)`
	cursor: no-drop;
	width: 160px;
	border: dotted 1.5px rgba(0, 0, 0, 0.2);
	background-color: initial;
`;

/**
 * Компонент MobilePaymentContract
 */
class MobilePaymentContract extends Component {
	/**
	 * Конструктор
	 * @param {Object} props свойства компонента MobilePaymentContract
	 */
	constructor(props) {
		super(props);

		this.state = {
			number: '+79218908064',
			amount: 0,
			commission: 3
		};
	}

	/**
	 * Получить цену с учетом комиссии
	 * @returns {Number}
	 */
	getSumWithCommission() {
		const {amount, commission} = this.state;

		const isNumber = !isNaN(parseFloat(amount)) && isFinite(amount);
		if (!isNumber || amount <= 0) {
			return 0;
		}

		return Number(amount) + Number(commission);
	}

	/**
	 * Отправка формы
	 * @param {Event} event событие отправки формы
	 */
	onSubmitForm(event) {
		if (event) {
			event.preventDefault();
		}

		const {amount, number, commission} = this.state;

		const isNumber = !isNaN(parseFloat(amount)) && isFinite(amount);
		if (!isNumber || amount === 0) {
			return;
		}

		const {activeCard} = this.props;

		axios
			.post(`/cards/${activeCard.id}/pay`, {number, amount})
			.then(() => this.props.onPaymentSuccess({amount, number, commission}));
	}

	/**
	 * Обработка изменения значения в input
	 * @param {Event} event событие изменения значения input
	 */
	onChangeInputValue(event) {
		if (!event) {
			return;
		}

		const {name, value} = event.target;

		this.setState({
			[name]: value
		});
	}

	/**
	 * Рендер компонента
	 *
	 * @override
	 * @returns {JSX}
	 */
	render() {
		const {commission} = this.state;

		return (
			<MobilePaymentLayout>
				<form onSubmit={(event) => this.onSubmitForm(event)}>
					<MobilePaymentTitle>Пополнить телефон</MobilePaymentTitle>
					<InputField>
						<Label>Телефон</Label>
						<InputPhoneNumber
							name='number'
							value={this.state.number}
							readOnly='true' />
					</InputField>
					<InputField>
						<Label>Сумма</Label>
						<InputSum
							name='amount'
							value={this.state.amount}
							onChange={(event) => this.onChangeInputValue(event)} />
						<Currency>₽</Currency>
					</InputField>
					<InputField>
						<Label>Спишется</Label>
						<InputCommision value={this.getSumWithCommission()} />
						<Currency>₽</Currency>
					</InputField>
					<Commission>Размер коммиссии составляет {commission} ₽</Commission>
					<Underline />
					<PaymentButton bgColor='#fff' textColor='#108051'>Заплатить</PaymentButton>
				</form>
			</MobilePaymentLayout>
		);
	}
}

MobilePaymentContract.propTypes = {
	activeCard: PropTypes.shape({
		id: PropTypes.number
	}).isRequired,
	onPaymentSuccess: PropTypes.func.isRequired
};

export default MobilePaymentContract;
