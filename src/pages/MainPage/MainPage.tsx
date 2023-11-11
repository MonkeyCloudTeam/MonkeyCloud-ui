import {SubmitHandler, useForm} from "react-hook-form";
import styles from "./MainPage.module.css"
import {AiOutlineUser} from "react-icons/ai";
import {SiSurveymonkey} from "react-icons/si";
import {BiSolidLockAlt} from "react-icons/bi";
import {LiaTelegramPlane} from "react-icons/lia";
import {Link} from "react-router-dom";
import {axiosInstance} from "../SignInPage/SignInPage";
import Modal from "react-modal";
import {useState , useEffect} from "react";

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
    const [modalIsOpen, setIsOpen] = useState(false);
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
            const response = await axiosInstance.post('/sign-out', {})
            console.log(response)
        } catch (error) {
            console.error(error)
        }
    }
    localStorage.clear()
    return (
        <section className={styles.body}>
            <Link to='/sign-in'>
            <button onClick={handleLogOff} type='submit' className={styles.Button}>
                    Выход
            </button>
            </Link>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div
                    className={styles.textModal}>
                    Пользователь {localStorage.getItem('username')} вошел</div>
                <button onClick={closeModal}
                        className={styles.Button}
                >Закрыть</button>

            </Modal>
        </section>
    )
}
export {
    MainPage,
}