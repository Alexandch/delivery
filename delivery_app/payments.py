from dataclasses import dataclass

from datetime import date

import re

import uuid





@dataclass(frozen=True)

class PaymentResult:

    success: bool

    payment_id: str = ''

    error: str = ''





def normalize_card_number(value):

    return re.sub(r'[\s-]+', '', value or '')





def passes_luhn(number):

    if not number.isdigit() or not 13 <= len(number) <= 19:

        return False

    checksum = 0

    parity = len(number) % 2

    for index, digit in enumerate(map(int, number)):

        if index % 2 == parity:

            digit *= 2

            if digit > 9:

                digit -= 9

        checksum += digit

    return checksum % 10 == 0





def validate_expiry(value, today=None):

    match = re.fullmatch(r'(0[1-9]|1[0-2])/(\d{2})', (value or '').strip())

    if not match:

        return False

    month, year = map(int, match.groups())

    today = today or date.today()

    return (2000 + year, month) >= (today.year, today.month)





def card_brand(number):

    if number.startswith('4'):

        return 'Visa'

    if len(number) >= 2 and 51 <= int(number[:2]) <= 55:

        return 'Mastercard'

    return 'Банковская карта'





def process_demo_payment(*, card_number, expiry_date, cvv, amount):

    """Локальная оплата для разработки; реквизиты карты не сохраняются и не логируются."""

    number = normalize_card_number(card_number)

    if not passes_luhn(number):

        return PaymentResult(False, error='Проверьте номер карты.')

    if not validate_expiry(expiry_date):

        return PaymentResult(False, error='Проверьте срок действия карты.')

    if not re.fullmatch(r'\d{3,4}', cvv or ''):

        return PaymentResult(False, error='CVV должен содержать 3 или 4 цифры.')

    if amount <= 0:

        return PaymentResult(False, error='Сумма платежа должна быть больше нуля.')

    if number.endswith('0000'):

        return PaymentResult(False, error='Банк отклонил платёж. Используйте другую карту.')

    return PaymentResult(True, payment_id=f'demo_{uuid.uuid4().hex}')

