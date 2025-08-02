import React from 'react'
import NavigationBar from '../ui/NavigationBar'
import Hero from '../ui/Hero'
import Features from '../ui/Features'
import ContactForm from '../ui/ContactForm'
import Dashboard from './dashboard'
const landingpage = () => {
  return (
    <div>
      <NavigationBar/>
      <main>
        <Hero/>
        <Features/>
        <ContactForm/>
      </main>
    </div>
  )
}


export default landingpage
