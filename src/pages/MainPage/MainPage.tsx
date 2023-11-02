import {SubmitHandler, useForm} from "react-hook-form";
import styles from "./MainPage.module.css"
import {AiOutlineUser} from "react-icons/ai";
import {SiSurveymonkey} from "react-icons/si";
import {BiSolidLockAlt} from "react-icons/bi";
import {LiaTelegramPlane} from "react-icons/lia";
import {Link} from "react-router-dom";
const MainPage= () => {
console.log(localStorage.getItem('token'));
    console.log(localStorage.getItem('status'));
    return (
        <section className={styles.body}>
        <div className={styles.signUp_section}>
            <h2>{localStorage.getItem('token')}</h2>
        </div>
        </section>
    )
}

export {
    MainPage,
}