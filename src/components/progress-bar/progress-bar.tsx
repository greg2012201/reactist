import * as React from 'react'
import { HiddenVisually } from '../../new-components/hidden-visually'
import classNames from 'classnames'

import './progress-bar.less'

type Props = {
    /** Additional css class applied to the progress bar. */
    className?: string
    /** How much of the progress bar should be filled. Number between 0 and 100 inclusive. */
    fillPercentage?: number
    /** Defines the human readable text alternative for assitive technologies. */
    'aria-valuetext'?: string
}
function ProgressBar({ fillPercentage = 0, className, 'aria-valuetext': ariaValuetext }: Props) {
    const finalClassName = classNames('reactist_progress_bar', className)
    const width = fillPercentage < 0 ? 0 : fillPercentage > 100 ? 100 : fillPercentage
    return (
        <div className={finalClassName}>
            <div className="inner" style={{ width: `${width}%` }} />
            <HiddenVisually>
                <progress value={width} max={100} aria-valuetext={ariaValuetext ?? undefined} />
            </HiddenVisually>
        </div>
    )
}
ProgressBar.displayName = 'ProgressBar'

export { ProgressBar }
