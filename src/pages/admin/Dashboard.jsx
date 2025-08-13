import React from 'react'
import styles from "../../styles/admin/Dashboard.module.css";
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import Grid from '../../components/admin/Grid';
import Verif from '../../components/admin/Verif';
import Verifcard from '../../components/admin/Verifcard';

function Dashboard() {
    return (
        <div className="containerAdmin">
            <Sidebar />
            <main className={styles.mainContent}>
                <Header />
                <Grid />
                      <div className={styles.verificationSection}>
                    <Verif />
                    <Verifcard />
                      </div>
            </main>

        </div>
    )
}

export default Dashboard