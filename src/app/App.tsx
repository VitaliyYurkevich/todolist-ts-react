import React, {useCallback, useEffect, useState} from 'react'
import {TodolistsList} from '../features/TodolistsList/TodolistsList'
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar'
import {useDispatch, useSelector} from 'react-redux'
import {Route, Routes} from 'react-router-dom'
import {Login} from '../features/Auth/Login'
import {
    AppBar, CircularProgress,
    Container,
    createTheme,
    CssBaseline,
    IconButton,
    LinearProgress,
    Menu,
    MenuItem,
    Switch,
    ThemeProvider,
    Toolbar,
    Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {selectIsInitialized, selectStatus} from "../features/Application/selectors";
import {selectIsLoggedIn} from "../features/Auth/selectors";
import {useActions} from "./store";
import {authActions} from "../features/Auth";
import {authThunk} from "../features/Auth/auth-reducer";
import {MenuButton} from "../features/MenuButton/MenuButton";
import {styled} from "@mui/material/styles";

type ThemeMode = 'dark' | 'light' | string

function App() {

    const status = useSelector(selectStatus)
    const isInitialized = useSelector(selectIsInitialized)
    const isLoggedIn = useSelector(selectIsLoggedIn)
    const dispatch = useDispatch<any>()
    const {logoutTC} = useActions(authActions)
    const [themeMode, setThemeMode] = useState<ThemeMode>('light')
    const [showBurger, setShowBurger] = useState(false)
    const theme = createTheme({
        palette: {
            mode: themeMode === 'light' ? 'light' : 'dark',
            primary: {
                main: '#087EA4',
            },
        },
    })

    useEffect(()=> {
        const newTheme = localStorage.getItem('theme')
        if(newTheme){
            let newValue = String(newTheme)
            setThemeMode(newValue)
        }
    },[])
    const changeModeHandler = () => {
        setThemeMode(themeMode == 'light' ? 'dark' : 'light')

    }
    const onClickHandler = () => {
        setShowBurger(!showBurger)
    }


   useEffect(()=> {
       localStorage.setItem('theme', themeMode)
   }, [themeMode])




    useEffect(() => {

        if (!isInitialized) {

            dispatch(authThunk.initializeAppTC())
        }
    }, [])

    const logoutHandler = useCallback(() => {

        logoutTC()

    }, [])

     if (!isInitialized) {
         return <div
             style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
             <CircularProgress/>
         </div>
     }



    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="App">
                <ErrorSnackbar/>
                <AppBar position="static" sx={{mb: '30px'}}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <MenuIcon onClick={onClickHandler}/>
                        </IconButton>
                        <StyledMenu open={showBurger} onClose={onClickHandler}>
                            <StyledMenuItem>
                                <MenuButton background={theme.palette.primary.dark}>Theme</MenuButton>
                                 <Switch  color={'default'} onChange={changeModeHandler}/>
                            </StyledMenuItem>
                        </StyledMenu>
                        <Typography variant="h6">
                            Todo
                        </Typography>
                        {isLoggedIn && <MenuButton color="inherit" onClick={logoutHandler}>Log out</MenuButton>}
                    </Toolbar>
                    {status === 'loading' && <LinearProgress/>}
                </AppBar>

                <Container fixed>
                    <Routes>
                        <Route path={'/'} element={<TodolistsList/>}/>
                        <Route path={'/todolist-ts-react'} element={<TodolistsList/>}/>
                        <Route path={'/login'} element={<Login/>}/>
                    </Routes>
                </Container>
            </div>
        </ThemeProvider>
    )
}


const StyledMenu = styled(Menu)`
  top: -730px;
 
  @media screen and (max-width: 680px) {
    top: -770px;
  }
  
`

const StyledMenuItem = styled(MenuItem)`
  @media screen and (max-width: 680px) {
    width: 200px;
    height: 40px;
  }
`
export default App
