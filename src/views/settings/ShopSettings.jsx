import React, { useEffect, useState } from 'react'
import { 
  CCard, CCardHeader, CCardBody, CButton, CAlert, CRow, CCol, CFormInput, 
  CFormTextarea, CFormSelect, CSpinner, CForm, CFormLabel, CInputGroup, 
  CInputGroupText, CFormCheck, CImage, CModal, CModalHeader, CModalTitle, 
  CModalBody, CModalFooter, CProgress
} from '@coreui/react'
import axiosClient from '../../lib/axiosClient'

const ShopSettings = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [logoPreview, setLogoPreview] = useState('')
  const [logoUploading, setLogoUploading] = useState(false)
  const [logoProgress, setLogoProgress] = useState(0)
  
  const [settings, setSettings] = useState({
    shopName: '',
    shopDescription: '',
    logo: '',
    contactEmail: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    website: '',
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    workingHours: '',
    timezone: 'Asia/Ho_Chi_Minh',
    currency: 'VND',
    language: 'vi',
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    googleAnalytics: '',
    facebookPixel: '',
    customCss: '',
    customJs: ''
  })

  const loadSettings = async () => {
    setLoading(true)
    try {
      // Mock data - in real app, this would be API call
      const mockSettings = {
        shopName: 'TechStore Pro',
        shopDescription: 'Your trusted technology partner for all your electronic needs',
        logo: 'https://via.placeholder.com/200x80/007bff/ffffff?text=TechStore',
        contactEmail: 'info@techstore.com',
        phone: '+84 123 456 789',
        address: '123 Tech Street',
        city: 'Ho Chi Minh City',
        country: 'Vietnam',
        zipCode: '700000',
        website: 'https://techstore.com',
        facebook: 'https://facebook.com/techstore',
        instagram: 'https://instagram.com/techstore',
        twitter: 'https://twitter.com/techstore',
        youtube: 'https://youtube.com/techstore',
        workingHours: 'Mon-Fri: 9AM-6PM, Sat-Sun: 10AM-4PM',
        timezone: 'Asia/Ho_Chi_Minh',
        currency: 'VND',
        language: 'vi',
        maintenanceMode: false,
        allowRegistration: true,
        requireEmailVerification: false,
        seoTitle: 'TechStore Pro - Premium Electronics Store',
        seoDescription: 'Shop the latest electronics and technology products at TechStore Pro',
        seoKeywords: 'electronics, technology, gadgets, smartphones, laptops',
        googleAnalytics: 'GA-XXXXXXXXX',
        facebookPixel: 'FB-XXXXXXXXX',
        customCss: '',
        customJs: ''
      }
      
      setSettings(mockSettings)
      setLogoPreview(mockSettings.logo)
    } catch (e) {
      setError('Không tải được cài đặt shop')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadSettings() }, [])

  const handleInputChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setError('Chỉ chấp nhận file hình ảnh')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Kích thước file không được vượt quá 5MB')
      return
    }

    setLogoUploading(true)
    setLogoProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setLogoProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // In real app, this would be actual file upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target.result)
        setSettings(prev => ({ ...prev, logo: e.target.result }))
        setLogoProgress(100)
        clearInterval(progressInterval)
      }
      reader.readAsDataURL(file)
      
    } catch (e) {
      setError('Lỗi khi upload logo')
    } finally {
      setLogoUploading(false)
    }
  }

  const saveSettings = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      // In real app, this would be API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess('Cài đặt shop đã được lưu thành công!')
      
      // Auto hide success message
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) {
      setError('Lỗi khi lưu cài đặt')
    } finally {
      setSaving(false)
    }
  }

  const resetToDefault = () => {
    if (window.confirm('Bạn có chắc chắn muốn reset về cài đặt mặc định?')) {
      loadSettings()
    }
  }

  return (
    <>
      <CRow className="mb-4">
        <CCol md={8}>
          <h2>Shop Settings</h2>
          <p className="text-muted">Cấu hình thông tin cơ bản của shop</p>
        </CCol>
        <CCol md={4} className="text-end">
          <CButton color="secondary" variant="outline" onClick={resetToDefault}>
            Reset to Default
          </CButton>
        </CCol>
      </CRow>

      {error && <CAlert color="danger" className="mb-4">{error}</CAlert>}
      {success && <CAlert color="success" className="mb-4">{success}</CAlert>}

      <CForm onSubmit={saveSettings}>
        <CRow>
          {/* Basic Information */}
          <CCol md={8}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Basic Information</strong>
              </CCardHeader>
              <CCardBody>
                <CRow className="g-3">
                  <CCol md={12}>
                    <CFormInput
                      label="Shop Name"
                      value={settings.shopName}
                      onChange={handleInputChange('shopName')}
                      placeholder="Enter shop name"
                      required
                    />
                  </CCol>
                  <CCol md={12}>
                    <CFormTextarea
                      label="Shop Description"
                      value={settings.shopDescription}
                      onChange={handleInputChange('shopDescription')}
                      placeholder="Enter shop description"
                      rows={3}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      label="Contact Email"
                      type="email"
                      value={settings.contactEmail}
                      onChange={handleInputChange('contactEmail')}
                      placeholder="info@shop.com"
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      label="Phone Number"
                      value={settings.phone}
                      onChange={handleInputChange('phone')}
                      placeholder="+84 123 456 789"
                    />
                  </CCol>
                  <CCol md={8}>
                    <CFormInput
                      label="Address"
                      value={settings.address}
                      onChange={handleInputChange('address')}
                      placeholder="123 Main Street"
                    />
                  </CCol>
                  <CCol md={4}>
                    <CFormInput
                      label="City"
                      value={settings.city}
                      onChange={handleInputChange('city')}
                      placeholder="Ho Chi Minh City"
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      label="Country"
                      value={settings.country}
                      onChange={handleInputChange('country')}
                      placeholder="Vietnam"
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      label="ZIP Code"
                      value={settings.zipCode}
                      onChange={handleInputChange('zipCode')}
                      placeholder="700000"
                    />
                  </CCol>
                  <CCol md={12}>
                    <CFormInput
                      label="Website"
                      value={settings.website}
                      onChange={handleInputChange('website')}
                      placeholder="https://shop.com"
                    />
                  </CCol>
                  <CCol md={12}>
                    <CFormInput
                      label="Working Hours"
                      value={settings.workingHours}
                      onChange={handleInputChange('workingHours')}
                      placeholder="Mon-Fri: 9AM-6PM, Sat-Sun: 10AM-4PM"
                    />
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>

            {/* Social Media */}
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Social Media Links</strong>
              </CCardHeader>
              <CCardBody>
                <CRow className="g-3">
                  <CCol md={6}>
                    <CInputGroup>
                      <CInputGroupText>
                        <i className="cil-facebook"></i>
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Facebook URL"
                        value={settings.facebook}
                        onChange={handleInputChange('facebook')}
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol md={6}>
                    <CInputGroup>
                      <CInputGroupText>
                        <i className="cil-instagram"></i>
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Instagram URL"
                        value={settings.instagram}
                        onChange={handleInputChange('instagram')}
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol md={6}>
                    <CInputGroup>
                      <CInputGroupText>
                        <i className="cil-twitter"></i>
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Twitter URL"
                        value={settings.twitter}
                        onChange={handleInputChange('twitter')}
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol md={6}>
                    <CInputGroup>
                      <CInputGroupText>
                        <i className="cil-youtube"></i>
                      </CInputGroupText>
                      <CFormInput
                        placeholder="YouTube URL"
                        value={settings.youtube}
                        onChange={handleInputChange('youtube')}
                      />
                    </CInputGroup>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>

            {/* SEO Settings */}
            <CCard className="mb-4">
              <CCardHeader>
                <strong>SEO Settings</strong>
              </CCardHeader>
              <CCardBody>
                <CRow className="g-3">
                  <CCol md={12}>
                    <CFormInput
                      label="SEO Title"
                      value={settings.seoTitle}
                      onChange={handleInputChange('seoTitle')}
                      placeholder="Shop Title - Best Products"
                    />
                  </CCol>
                  <CCol md={12}>
                    <CFormTextarea
                      label="SEO Description"
                      value={settings.seoDescription}
                      onChange={handleInputChange('seoDescription')}
                      placeholder="Shop description for search engines"
                      rows={2}
                    />
                  </CCol>
                  <CCol md={12}>
                    <CFormInput
                      label="SEO Keywords"
                      value={settings.seoKeywords}
                      onChange={handleInputChange('seoKeywords')}
                      placeholder="electronics, gadgets, technology"
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      label="Google Analytics ID"
                      value={settings.googleAnalytics}
                      onChange={handleInputChange('googleAnalytics')}
                      placeholder="GA-XXXXXXXXX"
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      label="Facebook Pixel ID"
                      value={settings.facebookPixel}
                      onChange={handleInputChange('facebookPixel')}
                      placeholder="FB-XXXXXXXXX"
                    />
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>

          {/* Logo & Settings */}
          <CCol md={4}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Shop Logo</strong>
              </CCardHeader>
              <CCardBody>
                <div className="text-center mb-3">
                  {logoPreview && (
                    <CImage
                      src={logoPreview}
                      alt="Shop Logo"
                      style={{ maxWidth: '200px', maxHeight: '80px', objectFit: 'contain' }}
                      className="border rounded"
                    />
                  )}
                </div>
                
                <CFormInput
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={logoUploading}
                />
                
                {logoUploading && (
                  <div className="mt-2">
                    <CProgress value={logoProgress} className="mb-2" />
                    <small className="text-muted">Uploading... {logoProgress}%</small>
                  </div>
                )}
                
                <small className="text-muted">
                  Recommended size: 200x80px, Max file size: 5MB
                </small>
              </CCardBody>
            </CCard>

            <CCard className="mb-4">
              <CCardHeader>
                <strong>General Settings</strong>
              </CCardHeader>
              <CCardBody>
                <CRow className="g-3">
                  <CCol md={12}>
                    <CFormSelect
                      label="Timezone"
                      value={settings.timezone}
                      onChange={handleInputChange('timezone')}
                    >
                      <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</option>
                      <option value="Asia/Bangkok">Asia/Bangkok</option>
                      <option value="Asia/Singapore">Asia/Singapore</option>
                      <option value="UTC">UTC</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={12}>
                    <CFormSelect
                      label="Currency"
                      value={settings.currency}
                      onChange={handleInputChange('currency')}
                    >
                      <option value="VND">VND (₫)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="THB">THB (฿)</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={12}>
                    <CFormSelect
                      label="Language"
                      value={settings.language}
                      onChange={handleInputChange('language')}
                    >
                      <option value="vi">Tiếng Việt</option>
                      <option value="en">English</option>
                      <option value="th">ไทย</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={12}>
                    <CFormCheck
                      id="maintenanceMode"
                      label="Maintenance Mode"
                      checked={settings.maintenanceMode}
                      onChange={handleInputChange('maintenanceMode')}
                    />
                  </CCol>
                  <CCol md={12}>
                    <CFormCheck
                      id="allowRegistration"
                      label="Allow User Registration"
                      checked={settings.allowRegistration}
                      onChange={handleInputChange('allowRegistration')}
                    />
                  </CCol>
                  <CCol md={12}>
                    <CFormCheck
                      id="requireEmailVerification"
                      label="Require Email Verification"
                      checked={settings.requireEmailVerification}
                      onChange={handleInputChange('requireEmailVerification')}
                    />
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>

            <CCard className="mb-4">
              <CCardHeader>
                <strong>Custom Code</strong>
              </CCardHeader>
              <CCardBody>
                <CFormTextarea
                  label="Custom CSS"
                  value={settings.customCss}
                  onChange={handleInputChange('customCss')}
                  placeholder="/* Custom CSS code */"
                  rows={4}
                />
                <CFormTextarea
                  label="Custom JavaScript"
                  value={settings.customJs}
                  onChange={handleInputChange('customJs')}
                  placeholder="/* Custom JavaScript code */"
                  rows={4}
                  className="mt-3"
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <CRow>
          <CCol className="text-end">
            <CButton 
              type="submit" 
              color="primary" 
              disabled={saving || logoUploading}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </CButton>
          </CCol>
        </CRow>
      </CForm>
    </>
  )
}

export default ShopSettings
