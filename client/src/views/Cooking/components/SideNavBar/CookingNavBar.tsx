import React from 'react'
import { Link } from 'react-router-dom'
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import './styles.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faClipboard,
    faUtensils,
    faInfo,
} from '@fortawesome/free-solid-svg-icons'

interface ICookingNavBarProps {
    menuItem: string
}

const CookingNavBar = ({ menuItem }: ICookingNavBarProps) => {
    return (
        <>
            <ProSidebar>
                <Menu>
                    <SubMenu
                        title="Recept"
                        icon={<FontAwesomeIcon icon={faClipboard} />}
                        defaultOpen={true}
                    >
                        <MenuItem active={menuItem === 'starters'}>
                            Förrätter <Link to="/starters" />
                        </MenuItem>
                        <MenuItem active={menuItem === 'mainCourses'}>
                            Varmrätter <Link to="/main-courses" />
                        </MenuItem>
                        <MenuItem active={menuItem === 'desserts'}>
                            Desserter <Link to="/desserts" />
                        </MenuItem>
                        <MenuItem active={menuItem === 'sauces'}>
                            Såser <Link to="/sauces" />
                        </MenuItem>
                        <MenuItem active={menuItem === 'marinades'}>
                            Marinader <Link to="/marinades" />
                        </MenuItem>
                        <MenuItem active={menuItem === 'baseRecipes'}>
                            Basrecept <Link to="/base-recipes" />
                        </MenuItem>
                        <MenuItem active={menuItem === 'drinks'}>
                            Drinkar <Link to="/drinks" />
                        </MenuItem>
                    </SubMenu>
                    <MenuItem
                        icon={<FontAwesomeIcon icon={faUtensils} />}
                        active={menuItem === 'tools'}
                    >
                        Bra redskap <Link to="/tools" />
                    </MenuItem>
                    <MenuItem
                        icon={<FontAwesomeIcon icon={faInfo} />}
                        active={menuItem === 'cooking-tips'}
                    >
                        Kocktips <Link to="/cooking-tips" />
                    </MenuItem>
                </Menu>
            </ProSidebar>
        </>
    )
}

export default CookingNavBar
