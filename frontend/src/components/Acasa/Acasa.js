import React from 'react'
import CustomHeader from '../CustomHeader'
import Navbar from '../Navbar'
import Despre from './Despre'
import Imagini from './Imagini'
import Aplica from './Aplica'
import PageHeader from '../PageHeader'
import PageFooter from '../PageFooter'

const Acasa = () => {
  return (
  <div className="landing-page sidebar-collapse">
    <CustomHeader titlu="River Wolves"/>
    <Navbar/>
    <div className="wrapper">
      <PageHeader/>
      <div className="main">
        <Despre/>
        <Imagini/>
        <Aplica/>
        <PageFooter/>
      </div>
    </div>
  </div>
  )
}

export default Acasa
