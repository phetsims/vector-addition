// Copyright 2019-2023, University of Colorado Boulder

/**
 * VectorAdditionCheckbox styles Checkbox for this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import { Node } from '../../../../scenery/js/imports.js';

type SelfOptions = EmptySelfOptions;

export type VectorAdditionCheckboxOptions = SelfOptions & CheckboxOptions;

export default class VectorAdditionCheckbox extends Checkbox {

  protected constructor( property: Property<boolean>, content: Node, providedOptions?: VectorAdditionCheckboxOptions ) {

    const options = optionize<VectorAdditionCheckboxOptions, SelfOptions, CheckboxOptions>()( {

      // CheckboxOptions
      boxWidth: VectorAdditionConstants.CHECKBOX_BOX_WIDTH,
      touchAreaXDilation: 5,
      touchAreaYDilation: 3.5
    }, providedOptions );

    super( property, content, options );

    this.touchArea = this.localBounds.dilatedXY( options.touchAreaXDilation, options.touchAreaYDilation );
  }
}

vectorAddition.register( 'VectorAdditionCheckbox', VectorAdditionCheckbox );