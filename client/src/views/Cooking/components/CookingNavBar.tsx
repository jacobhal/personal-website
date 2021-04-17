import React from 'react'
import { Link } from 'react-router-dom'
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import 'react-pro-sidebar/dist/css/styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faClipboard,
    faUtensils,
    faInfo,
} from '@fortawesome/free-solid-svg-icons'

const CookingNavBar = () => {
    return (
        <>
            <ProSidebar>
                <Menu>
                    <SubMenu
                        title="Recept"
                        icon={<FontAwesomeIcon icon={faClipboard} />}
                    >
                        <MenuItem>
                            Förrätter <Link to="/starters" />
                        </MenuItem>
                        <MenuItem>
                            Varmrätter <Link to="/main-courses" />
                        </MenuItem>
                        <MenuItem>
                            Desserter <Link to="/desserts" />
                        </MenuItem>
                        <MenuItem>
                            Såser <Link to="/sauces" />
                        </MenuItem>
                        <MenuItem>
                            Marinader <Link to="/marinades" />
                        </MenuItem>
                        <MenuItem>
                            Basrecept <Link to="/base-recipes" />
                        </MenuItem>
                        <MenuItem>
                            Drinkar <Link to="/drinks" />
                        </MenuItem>
                    </SubMenu>
                    <MenuItem icon={<FontAwesomeIcon icon={faUtensils} />}>
                        Bra redskap <Link to="/tools" />
                    </MenuItem>
                    <MenuItem icon={<FontAwesomeIcon icon={faInfo} />}>
                        Kocktips <Link to="/cooking-tips" />
                    </MenuItem>
                </Menu>
            </ProSidebar>
        </>
    )
}

export default CookingNavBar
