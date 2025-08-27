import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './layout/Layout'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Debate from './pages/Debate'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/debate" element={<Debate />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
