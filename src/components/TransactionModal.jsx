import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const TransactionModal = ({ show, onClose, onSave, categories }) => {
  const [transactionType, setTransactionType] = useState('Расход');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      type: transactionType,
      amount: parseFloat(amount),
      category,
      date,
      description
    });
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Добавить операцию</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Тип операции</Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                label="Расход"
                name="transactionType"
                id="expenseRadio"
                checked={transactionType === 'Расход'}
                onChange={() => setTransactionType('Расход')}
              />
              <Form.Check
                inline
                type="radio"
                label="Доход"
                name="transactionType"
                id="incomeRadio"
                checked={transactionType === 'Доход'}
                onChange={() => setTransactionType('Доход')}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Сумма</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Категория</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Дата</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Описание</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onClose} className="me-2">
              Отмена
            </Button>
            <Button variant="primary" type="submit">
              Сохранить
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TransactionModal;