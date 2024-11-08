import { List, ListItem, ListItemText, Paper, ListItemButton, Stack } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

MenuListItem.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            path: PropTypes.string
        })
    )
};
function MenuListItem({ data = [] }) {
    return (
        <Stack sx={{px:1}}>
            <List>
                {data.map((item, index) => (
                    <ListItem divider key={index}>
                        <ListItemButton disableGutters component={Link} to={item.path}>
                            <ListItemText primaryTypographyProps={{ fontSize: '14px' }} primary={item.title} />
                            <ChevronRightIcon />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Stack>
    )
}

export default MenuListItem
