import { CircularProgress, Backdrop } from '@material-ui/core';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';

import Signup from '../routes/Signup';
import Signin from '../routes/Signin';
import Recovery from '../routes/Recovery';
import NotFound from '../routes/Errors/NotFound';
import IncomeForm from '../routes/IncomeForm';
import IncomeList from '../routes/IncomeList';
import ExpenseForm from '../routes/ExpenseForm';
import ExpenseList from '../routes/ExpenseList';
import FlashMessage from '../components/FlashMessage';
import PrivatePageShell from '../components/PrivatePageShell';
import ConfirmDialog from '../components/ConfirmDialog';
import { useState, useMemo } from 'react';
import SortDialog from '../components/SortDialog';
import useCounting from '../hooks/useCounting';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

function App() {
    const location = useLocation();
    const tabValue = useMemo(() => {
        const tabIndex = {
            '/portal/incomes/new': 0,
            '/portal/incomes': 0,
            '/portal/expenses': 1,
            '/portal/expenses/new': 1,
            '/portal/reports': 2,
        };
        if (tabIndex[location.pathname] !== undefined) {
            return tabIndex[location.pathname];
        } else {
            if (/\/portal\/incomes\/\d+/gi.test(location.pathname)) {
                return 0;
            } else if (/\/portal\/expenses\/\d+/gi.test(location.pathname)) {
                return 1;
            }
        }
        return 2;
    }, [location.pathname]);

    const {
        searchingCount,
        sortingCount,
        sort,
        search,
        onSortApply,
        onSearchApply,
        onSortReset,
        onSearchReset,
    } = useCounting(tabValue);
    const dispatch = useDispatch();
    const classes = useStyles();
    const loading = useSelector((state) => state.app.loading);
    const flashMessage = useSelector((state) => state.app.flashMessage);
    const flashMessageSeverity = useSelector((state) => state.app.flashMessageSeverity);
    const confirm = useSelector((state) => state.app.confirm);
    const showConfirmDialog = useMemo(() => Boolean(confirm), [confirm]);
    const confirmObj = useMemo(() => confirm || {}, [confirm]);
    const [dialog, setDialog] = useState('');

    const handleClose = () => dispatch({ type: 'Reducer - app: clear flash message' });

    return (
        <>
            <Switch>
                <Route exact path="/signin">
                    <Signin />
                </Route>
                <Route exact path="/signup">
                    <Signup />
                </Route>
                <Route exact path="/recovery">
                    <Recovery />
                </Route>
                <Route path="/portal">
                    <PrivatePageShell
                        tabValue={tabValue}
                        searchingCount={searchingCount}
                        sortingCount={sortingCount}
                        onSearch={() => setDialog('search')}
                        onSort={() => setDialog('sort')}>
                        <Switch>
                            <Route
                                exact
                                path={['/portal/incomes/new', '/portal/incomes/:id(\\d+)']}>
                                <IncomeForm />
                            </Route>
                            <Route
                                exact
                                path={['/portal/expenses/new', '/portal/expenses/:id(\\d+)']}>
                                <ExpenseForm />
                            </Route>
                            <Route exact path="/portal/incomes">
                                <IncomeList />
                            </Route>
                            <Route exact path="/portal/expenses">
                                <ExpenseList />
                            </Route>
                            <Route>
                                <Redirect to="/portal/reports" />
                            </Route>
                        </Switch>
                    </PrivatePageShell>
                </Route>
                <Route exact path="/">
                    <Redirect to="/portal/reports" />
                </Route>
                <Route path="*">
                    <NotFound />
                </Route>
            </Switch>
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <FlashMessage
                open={Boolean(flashMessage)}
                message={flashMessage}
                severity={flashMessageSeverity}
                timeout={3000}
                onClose={handleClose}
            />
            <ConfirmDialog
                open={showConfirmDialog}
                title={confirmObj.title}
                message={confirmObj.message}
                type={confirmObj.type}
                onYes={() =>
                    dispatch({ type: confirmObj.payload.type, payload: confirmObj.payload.payload })
                }
                onNo={() => dispatch({ type: 'Reducer - app: clear confirm' })}
            />
            <SortDialog
                date={sort.byDate}
                amount={sort.byAmount}
                open={dialog === 'sort'}
                onClose={() => setDialog('')}
                onReset={(payload) => {
                    onSortReset(payload);
                    setDialog(null);
                }}
                onApply={(payload) => {
                    onSortApply(payload);
                    setDialog(null);
                }}
            />
        </>
    );
}

export default App;
