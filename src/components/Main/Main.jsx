import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './main.module.css';

const Main = () => {

  const [formValues, setFormValues] = useState({
      'name': '', 
      'room': ''
  });

  const navigate = useNavigate();

  const handleInputChange = ({ target: { name, value } }) => {
      setFormValues(prevValues => ({
        ...prevValues,
        [name]: value
      }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const isDisabled = Object.values(formValues).some((field) => !field.trim());

    if (!isDisabled) {
      navigate(`/chat?name=${formValues.name}&room=${formValues.room}`);
    } else {
      alert('Поле формы не может быть пустым.')
    }
    
  };

  return (
    <div className={styles.wrap}>
       <div className={styles.container}>
          <h1 className={styles.heading}>Войти в чат</h1>
 
          <form className={styles.form} onSubmit={handleFormSubmit}>
             <div className={styles.group}>
                <input
                   type="text"
                   name="name"
                   value={formValues.name}
                   placeholder="Никнейм"
                   className={styles.input}
                   onChange={handleInputChange}
                   autoComplete="off"
                   required
                />
             </div>
             <div className={styles.group}>
                <input
                   type="text"
                   name="room"
                   placeholder="Название комнаты"
                   value={formValues.room}
                   className={styles.input}
                   onChange={handleInputChange}
                   autoComplete="off"
                   required
                />
             </div>
             <div className={styles.group}>
                <button type="submit" className={styles.button}>
                   Войти
                </button>
             </div>
          </form>
       </div>
    </div>
 );
}

export default Main