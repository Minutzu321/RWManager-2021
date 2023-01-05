import React  from 'react';
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

const CustomHeader = ({ titlu }) => {
    return (
        <Helmet>
            <title>
                {titlu}
            </title>
        </Helmet>
    )
}

CustomHeader.propTypes = {
    titlu: PropTypes.string.isRequired,
}

export default CustomHeader
