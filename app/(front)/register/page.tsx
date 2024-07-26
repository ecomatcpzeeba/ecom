import React from 'react'
import Form from './Form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Register',
}

export default async function Register() {
  return <Form />
}
