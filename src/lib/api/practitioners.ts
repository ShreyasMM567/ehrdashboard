import axios from 'axios'

// Function to get a single practitioner by ID
export async function getPractitioner(id: string) {
  try {
    const response = await axios.get(`/api/practitioners/${id}`)
    const resource = response.data
    
    // Transform FHIR Practitioner resource to our interface
    let name = 'Unknown Practitioner'
    if (resource.name && resource.name.length > 0) {
      const practitionerName = resource.name[0]
      const given = practitionerName.given ? practitionerName.given.join(' ') : ''
      const family = practitionerName.family || ''
      name = `${given} ${family}`.trim() || 'Unknown Practitioner'
    }
    
    return {
      id: resource.id || '',
      name: name,
      email: resource.telecom?.find((t: any) => t.system === 'email')?.value || '',
      phone: resource.telecom?.find((t: any) => t.system === 'phone')?.value || '',
      active: resource.active !== false
    }
  } catch (error) {
    console.error('Error fetching practitioner:', error)
    return null
  }
}
