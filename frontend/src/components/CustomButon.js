import React  from 'react';
import PropTypes from 'prop-types'
import classnames from 'classnames';

const CustomButon = ({ tip, stil, marime, continut, disabled }) => {
    return <button type="button" className={classnames('btn', tip, stil, marime)} disabled={disabled}>{ continut }</button>
}

CustomButon.defaultProps = {
    tip: 'btn-primary',
    stil: '',
    marime: '',
    disabled: false,
}

CustomButon.propTypes = {
    continut: PropTypes.any.isRequired
}

export default CustomButon
