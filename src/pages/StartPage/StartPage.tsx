import {SubmitHandler, useForm} from "react-hook-form";
import styles from "./StartPage.module.css"
import {AiOutlineUser} from "react-icons/ai";
import {SiSurveymonkey} from "react-icons/si";
import {BiSolidLockAlt} from "react-icons/bi";
import {LiaTelegramPlane} from "react-icons/lia";
import {Link} from "react-router-dom";

const StartPage= () => {

    return (
        <div className={styles.signUp_section}>
          <h2>Hello</h2>
            <div className={styles.signUpButton}>
                        <Link to='/sign-in'>
                            Войти
                        </Link>
            </div>
            <div className={styles.signUpButton}>
                    <Link to='/sign-up'>
                        Зарегестрироваться
                    </Link>
            </div>
        </div>
    )
}

export {
    StartPage,
}