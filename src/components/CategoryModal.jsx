import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CategoryModal = ({ show, onClose, onSave }) => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState('Расход');
  const [categoryIcon, setCategoryIcon] = useState('🍔 Продукты');
  const [categoryColor, setCategoryColor] = useState('#563d7c');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name: categoryName,
      type: categoryType,
      icon: categoryIcon,
      color: categoryColor
    });
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Добавить категорию</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Название категории</Form.Label>
            <Form.Control
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Тип</Form.Label>
            <Form.Select 
              value={categoryType}
              onChange={(e) => setCategoryType(e.target.value)}
            >
              <option value="Расход">Расход</option>
              <option value="Доход">Доход</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Иконка</Form.Label>
            <Form.Select
              value={categoryIcon}
              onChange={(e) => setCategoryIcon(e.target.value)}
            >
              <option>🍔 Продукты</option>
              <option>🚕 Транспорт</option>
              <option>☕ Кафе</option>
              <option>🏠 ЖКХ</option>
              <option>🎬 Развлечения</option>
              <option>💊 Здоровье</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Цвет</Form.Label>
            <Form.Control
              type="color"
              value={categoryColor}
              onChange={(e) => setCategoryColor(e.target.value)}
              className="form-control-color"
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

export default CategoryModal;