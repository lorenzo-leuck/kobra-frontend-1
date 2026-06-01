import { useState } from 'react'
import { Plus, Trash2, Edit2, Megaphone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import type { Banner, AppAction } from '../../types'

interface BannerManagerProps {
  banners: Banner[]
  dispatch: React.Dispatch<AppAction>
}

interface BannerFormData {
  title: string
  description: string
  color: string
}

const BANNER_COLORS = ['#d4dcfc', '#d5ebe3', '#dce3ed', '#fde68a', '#fce7f3', '#e0e7ff', '#d1fae5', '#fee2e2']

export function BannerManager({ banners, dispatch }: BannerManagerProps) {
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [formData, setFormData] = useState<BannerFormData>({
    title: '',
    description: '',
    color: '#d4dcfc',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    if (editingBanner) {
      dispatch({
        type: 'UPDATE_BANNER',
        payload: { ...editingBanner, ...formData },
      })
    } else {
      dispatch({
        type: 'ADD_BANNER',
        payload: {
          id: String(Date.now()),
          ...formData,
        },
      })
    }

    handleClose()
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      description: banner.description,
      color: banner.color,
    })
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      dispatch({ type: 'DELETE_BANNER', payload: id })
    }
  }

  const handleAdd = () => {
    setEditingBanner(null)
    setFormData({
      title: '',
      description: '',
      color: '#d4dcfc',
    })
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
    setEditingBanner(null)
    setFormData({
      title: '',
      description: '',
      color: '#d4dcfc',
    })
    setErrors({})
  }

  const handleChange = (field: keyof BannerFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [field]: e.target.value })
    if (errors[field]) {
      const next = { ...errors }
      delete next[field]
      setErrors(next)
    }
  }

  return (
    <section className="banner-manager">
      <div className="banner-manager__header">
        <div>
          <h3 className="banner-manager__title">Banners</h3>
          <p className="banner-manager__subtitle">
            Custom banners appear in the carousel on the board page.
          </p>
        </div>
        <Button size="sm" variant="secondary" icon={Plus} onClick={handleAdd}>
          Add Banner
        </Button>
      </div>

      {banners.length === 0 ? (
        <div className="banner-manager__empty">
          <Megaphone size={32} className="banner-manager__empty-icon" />
          <p>No custom banners yet</p>
          <p className="banner-manager__empty-hint">Add one to promote events, volunteering, or donations.</p>
        </div>
      ) : (
        <div className="banner-manager__list">
          <AnimatePresence mode="popLayout">
            {banners.map((banner, index) => (
              <motion.div
                key={banner.id}
                className="banner-manager__card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                layout
              >
                <div
                  className="banner-manager__preview"
                  style={{ backgroundColor: banner.color }}
                >
                  <div className="banner-manager__preview-inner">
                    <p className="banner-manager__preview-title">{banner.title}</p>
                    <p className="banner-manager__preview-desc">{banner.description}</p>
                    <div className="banner-manager__preview-dots">
                      <span className="banner-manager__dot banner-manager__dot--active" />
                      <span className="banner-manager__dot" />
                      <span className="banner-manager__dot" />
                    </div>
                  </div>
                </div>
                <div className="banner-manager__actions">
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={Edit2}
                    onClick={() => handleEdit(banner)}
                    aria-label="Edit banner"
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={Trash2}
                    onClick={() => handleDelete(banner.id)}
                    aria-label="Delete banner"
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal
        open={showModal}
        onClose={handleClose}
        title={editingBanner ? 'Edit Banner' : 'Add Banner'}
      >
        <form className="form" onSubmit={handleSubmit} noValidate>
          <Input
            label="Title"
            name="title"
            placeholder="e.g. Volunteer at the Shelter"
            value={formData.title}
            onChange={handleChange('title')}
            error={errors.title}
            required
          />
          <div className="input-group">
            <label htmlFor="banner-desc" className="input-group__label">Description</label>
            <textarea
              id="banner-desc"
              name="description"
              className={`input-group__input ${errors.description ? 'input-group__input--error' : ''}`}
              placeholder="e.g. Help us care for animals and make a difference."
              value={formData.description}
              onChange={handleChange('description')}
              rows={3}
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'banner-desc-error' : undefined}
            />
            {errors.description && (
              <span id="banner-desc-error" className="input-group__error" role="alert">
                {errors.description}
              </span>
            )}
          </div>
          <div className="banner-manager__color-picker">
            <label className="input-group__label">Background Color</label>
            <div className="banner-manager__color-options">
              {BANNER_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`banner-manager__color-swatch ${formData.color === color ? 'banner-manager__color-swatch--active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData({ ...formData, color })}
                  aria-label={`Select color ${color}`}
                />
              ))}
              <div className="banner-manager__color-custom">
                <input
                  type="color"
                  value={formData.color}
                  onChange={handleChange('color')}
                  id="banner-color-custom"
                />
                <label htmlFor="banner-color-custom" className="banner-manager__color-custom-label">
                  Custom
                </label>
              </div>
            </div>
          </div>
          <div className="banner-manager__modal-preview" style={{ backgroundColor: formData.color }}>
            <p className="banner-manager__modal-preview-title">{formData.title || 'Banner title'}</p>
            <p className="banner-manager__modal-preview-desc">{formData.description || 'Banner description will appear here'}</p>
          </div>
          <div className="form__actions">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">{editingBanner ? 'Update' : 'Add'} Banner</Button>
          </div>
        </form>
      </Modal>
    </section>
  )
}
