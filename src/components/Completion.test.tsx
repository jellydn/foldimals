import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { lessons } from '../data/lessons'
import { Completion } from './Completion'

describe('Completion', () => {
  it('revokes replaced and unmounted photo URLs', async () => {
    const createObjectURL = vi.spyOn(URL, 'createObjectURL')
      .mockReturnValueOnce('blob:first')
      .mockReturnValueOnce('blob:second')
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
    const user = userEvent.setup()
    const { unmount } = render(<Completion lesson={lessons[0]} onAnother={() => undefined} onCollection={() => undefined} />)
    const input = screen.getByLabelText('📷 Add your photo')

    await user.upload(input, new File(['first'], 'first.png', { type: 'image/png' }))
    await user.upload(input, new File(['second'], 'second.png', { type: 'image/png' }))

    expect(createObjectURL).toHaveBeenCalledTimes(2)
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:first')
    unmount()
    expect(revokeObjectURL).toHaveBeenLastCalledWith('blob:second')
  })
})
