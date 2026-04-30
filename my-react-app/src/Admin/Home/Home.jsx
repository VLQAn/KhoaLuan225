import styles from "./Home.module.css";
import {
    MdClose,
    MdSettings,
    MdDashboard,
    MdPeople,
    MdAnalytics,
    MdMessage,
    MdShoppingCart,
    MdAddBox,
    MdLogout,
    MdReport
} from "react-icons/md";

const s = styles;

const Home = () => {
    return (    
        <div className={s.container}>
            {/*aside section start */}
            <aside>
                <div className={s.top}>
                    <div className={s.logo}>
                        <h2>RACSO</h2>
                    </div>
                    <div className={s.close}>
                        <MdClose />
                    </div>
                </div>

                {/* sidebar start */}
                <div className={s.sidebar}>
                    <a href="#">
                        <span><MdDashboard /></span>
                        <h3>Dashboard</h3>
                    </a>
                    <a href="#" className={s.active}>
                        <span><MdPeople /></span>
                        <h3>Custumers</h3>
                    </a>
                    <a href="#">
                        <span><MdAnalytics /></span>
                        <h3>Analytics</h3>
                    </a>
                    <a href="#">
                        <span><MdMessage /></span>
                        <h3>Messages</h3>
                        <span className={s.msg_count}>10</span>
                    </a>
                    <a href="#">
                        <span><MdShoppingCart /></span>
                        <h3>Products</h3>
                    </a>
                    <a href="#">
                        <span><MdReport /></span>
                        <h3>Reports</h3>
                    </a>
                    <a href="#">
                        <span><MdAddBox /></span>
                        <h3>Add products</h3>
                    </a>
                    <a href="#">
                        <span><MdLogout /></span>
                        <h3>Logout</h3>
                    </a>

                </div>
                {/* sidebar end */}
            </aside>
            {/*aside section end */}
            {/* main section start */}
            <main>
                <h1>Main</h1>
            </main>
            {/* main section end */}
            {/* right section start */}
            <div className={s.right}>
                <h1>Right</h1>
            </div>
            {/* end right section */}
            
        </div>
    );
}

export default Home;