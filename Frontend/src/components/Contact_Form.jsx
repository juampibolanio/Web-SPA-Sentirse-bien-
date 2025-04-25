import React, { useState } from 'react';
import styles from '../styles/Contact_Form.module.css';
import emailjs from 'emailjs-com';

const Contacto = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Formulario enviado:', formData);

        // Reemplaza con tus propios valores de EmailJS
        const serviceID = 'service_740jui9'; // Obtén el ID del servicio en tu cuenta de EmailJS
        const templateID = 'template_ey91ehp'; // Obtén el ID de la plantilla en tu cuenta de EmailJS
        const userID = 'Jxi-rcnsc0T3gnOtc'; // Obtén tu user_id de EmailJS

        // Enviar el correo a través de EmailJS
        emailjs.send(serviceID, templateID, formData, userID)
            .then((response) => {
                console.log('Correo enviado:', response);
                alert('Tu mensaje ha sido enviado correctamente');
                setFormData({
                    name: '',
                    email: '',
                    message: ''
                }); // Limpiar formulario después de enviar
            })
            .catch((err) => {
                console.error('Error al enviar correo:', err);
                alert('Ocurrió un error al enviar tu mensaje');
            });
    };

    return (
        <section className={styles.contactForm}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.input}
                    required
                    placeholder='Ingresa tu nombre *'
                />

                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.input}
                    required
                    placeholder='Ingresa tu correo electrónico *'
                />

                <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className={styles.textarea}
                    required
                    placeholder='Ingresa tu mensaje *'
                ></textarea>

                <button type="submit" className={styles.button}>Enviar</button>
            </form>
        </section>
    );
};

export default Contacto;
