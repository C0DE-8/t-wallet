import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../../api/axios'

const VISITOR_KEY = 'visitor-id'
const pageRequests = new Map()

function deviceType() {
  if (window.matchMedia('(max-width: 767px)').matches) return 'mobile'
  if (window.matchMedia('(max-width: 1024px)').matches) return 'tablet'
  return 'desktop'
}

function pageData(location) {
  const params = new URLSearchParams(location.search)
  return {
    current_page: `${location.pathname}${location.search}`,
    referrer: document.referrer,
    language: navigator.language,
    device_type: deviceType(),
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_term: params.get('utm_term') || '',
    utm_content: params.get('utm_content') || '',
  }
}

function VisitorTracking() {
  const location = useLocation()
  const visitorId = useRef(sessionStorage.getItem(VISITOR_KEY))

  useEffect(() => {
    const pageUrl = `${location.pathname}${location.search}`
    const visitKey = `visitor-page:${pageUrl}`
    
    // Skip if already recorded in this session
    if (sessionStorage.getItem(visitKey) === 'recorded') return undefined

    let active = true
    let startTime = Date.now()
    let highestScroll = 0
    const eventQueue = []

    const sendEvent = async (eventType, eventData = {}) => {
      const id = visitorId.current
      if (!id) {
        eventQueue.push([eventType, eventData])
        return
      }
      try {
        await api.post('/api/visitors/events', { 
          visitor_id: id, 
          event_type: eventType, 
          event_data: eventData, 
          page_url: pageUrl 
        })
      } catch (error) {
        console.warn('Visitor event was not recorded.', error)
      }
    }

    const trackPage = async () => {
      try {
        let request = pageRequests.get(pageUrl)
        if (!request) {
          request = api.post('/api/visitors/track', pageData(location))
          pageRequests.set(pageUrl, request)
        }
        const response = await request
        const id = response.data?.data?.id
        if (!id) return
        
        visitorId.current = id
        sessionStorage.setItem(VISITOR_KEY, String(id))
        sessionStorage.setItem(visitKey, 'recorded')
        
        if (!active) return
        while (eventQueue.length) {
          const [type, data] = eventQueue.shift()
          await sendEvent(type, data)
        }
      } catch (error) {
        pageRequests.delete(pageUrl)
        console.warn('Visitor page view was not recorded.', error)
      }
    }

    const onScroll = () => {
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight
      const depth = pageHeight > 0 ? Math.round((window.scrollY / pageHeight) * 100) : 100
      const milestone = Math.min(100, Math.floor(depth / 25) * 25)
      if (milestone > highestScroll && milestone > 0) {
        highestScroll = milestone
        sendEvent('scroll_depth', { percent: milestone })
      }
    }

    const onClick = (event) => {
      const target = event.target.closest('a, button')
      if (!target) return
      sendEvent('click', {
        element: target.tagName.toLowerCase(),
        label: (target.getAttribute('aria-label') || target.textContent || '').trim().slice(0, 100),
        href: target instanceof HTMLAnchorElement ? target.pathname : undefined,
      })
    }

    const onPageExit = () => {
      sendEvent('time_on_page', { 
        seconds: Math.round((Date.now() - startTime) / 1000), 
        scroll_depth: highestScroll 
      })
    }

    // Track the page immediately
    trackPage()

    // Add event listeners
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('click', onClick)
    window.addEventListener('pagehide', onPageExit)

    return () => {
      active = false
      onPageExit()
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('click', onClick)
      window.removeEventListener('pagehide', onPageExit)
    }
  }, [location])

  // No UI rendered - this component works silently in the background
  return null
}

export default VisitorTracking