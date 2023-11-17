import styles from './MainPage.module.css'
import {Link, Navigate, useNavigate} from 'react-router-dom'
import Modal from 'react-modal'
import React, { useState , useEffect,  } from 'react'
import {axiosInstance} from "../api";

Modal.setAppElement('#root');

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};
const MainPage= () => {

    const navigate = useNavigate()
    const [modalIsOpen, setIsOpen] = useState(false);
    const userToken = localStorage.getItem('token')

    useEffect(() => {
        openModal();
    }, []);

    if(!userToken) {
        return <Navigate to='/sign-in' />
    }

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    console.log(localStorage.getItem('token'));
    console.log(localStorage.getItem('username'));
    const handleLogOff = async ()=> {
        try {
            const response = await axiosInstance.post('/sign-out')
            console.log(response)
            localStorage.clear()
        } catch (error) {
            console.error(error)
            //@ts-ignore
            if (error?.response.status === 408 ){
                localStorage.clear()
                navigate('/sign-in')
            }
        }
        navigate('/sign-in')
    }

    return (
        <div className={styles.MainPageContainer}>
            <div
                className={styles.message}>
                Пользователь {localStorage.getItem('username')} вошел
            </div>
            <Link
                to='/sign-in'
                onClick={handleLogOff}
                className={styles.Button}
            >
               <span>Выход</span>
            </Link>
                {/*<Modal*/}
                {/*    isOpen={modalIsOpen}*/}
                {/*    onRequestClose={closeModal}*/}
                {/*    style={customStyles}*/}
                {/*    contentLabel="Example Modal"*/}
                {/*>*/}
                {/*    <div*/}
                {/*        className={styles.textModal}>*/}
                {/*        Пользователь {localStorage.getItem('username')} вошел</div>*/}
                {/*    <button onClick={closeModal}*/}
                {/*            className={styles.ModalButton}*/}
                {/*    >Закрыть</button>*/}
                {/*</Modal>*/}
        </div>
    )
}
export {
    MainPage,
}