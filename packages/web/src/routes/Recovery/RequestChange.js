import { Button, TextField, makeStyles, Typography, IconButton, Collapse } from '@material-ui/core';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';

import ErrorAlert from '../../components/ErrorAlert';

const useStyles = makeStyles((theme) => ({
    formSignup: {
        marginTop: theme.spacing(5),
        '& .MuiTextField-root + .MuiTextField-root': {
            marginTop: theme.spacing(2),
        },
        '& .MuiButton-root': {
            marginTop: theme.spacing(3),
        },
    },
    boxPageTitle: {
        marginTop: theme.spacing(12),
        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(3),
        },
        display: 'flex',
        alignItems: 'flex-start',
    },
    boxSignup: {
        marginTop: theme.spacing(5),
        '& .MuiTypography-root + .MuiTypography-root': {
            marginTop: theme.spacing(1),
        },
    },
    boxError: {
        marginTop: theme.spacing(3),
    },
    boxInfo: {
        marginTop: theme.spacing(5),
    },
    btnPreviousRoot: {
        marginRight: theme.spacing(3),
    },
}));

export default function Signin() {
    const status = useSelector((state) => state.recovery.status);
    const dispatch = useDispatch();
    const classes = useStyles();
    const error = useSelector((state) => state.signin.error);
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: yup.object({
            email: yup
                .string('enter email')
                .required('email is required')
                .email('enter a valid email'),
        }),
        onSubmit: ({ email }) => {
            dispatch({
                type: 'Saga: submit recovery form',
                payload: { email },
            });
        },
    });

    let el = null;
    if (status === 'error') {
        el = (
            <Alert severity="info" className={classes.boxInfo}>
                <AlertTitle>Sent</AlertTitle>
                An email has been sent to your email{' '}
                <a href={`mailto:${formik.values.email}`}>{formik.values.email}</a>. Please follow
                the instruction in the email to recover your password.
            </Alert>
        );
    } else {
        el = (
            <form className={classes.formSignup} onSubmit={formik.handleSubmit}>
                <TextField
                    id="your-email"
                    label="Your Email"
                    variant="filled"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    fullWidth
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={
                        formik.touched.email && formik.errors.email
                            ? formik.errors.email
                            : 'enter your email to recover password'
                    }
                />
                <Button variant="contained" color="primary" fullWidth size="large" type="submit">
                    Submit
                </Button>
            </form>
        );
    }

    return (
        <>
            <div className={classes.boxPageTitle}>
                <IconButton
                    classes={{ root: classes.btnPreviousRoot }}
                    component={Link}
                    to="/signin"
                    edge="start"
                    title="go back to login page"
                    aria-label="go back to login page">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1">
                    Re-password
                </Typography>
            </div>
            {el}
            <Collapse in={Boolean(error)}>
                <ErrorAlert
                    className={classes.boxError}
                    title={error && error.title}
                    onClose={() => dispatch({ type: 'Reducer - recovery: clear errors' })}>
                    {error ? error.messages.map((e) => <div key={e}>{e}</div>) : null}
                </ErrorAlert>
            </Collapse>
        </>
    );
}
