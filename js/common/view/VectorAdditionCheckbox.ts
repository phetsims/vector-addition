// Copyright 2019-2025, University of Colorado Boulder

/**
 * VectorAdditionCheckbox styles Checkbox for this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

type SelfOptions = EmptySelfOptions;

export type VectorAdditionCheckboxOptions = SelfOptions & WithRequired<CheckboxOptions, 'tandem'>;

export default class VectorAdditionCheckbox extends Checkbox {

  protected constructor( property: Property<boolean>, content: Node, providedOptions?: VectorAdditionCheckboxOptions ) {

    const options = optionize<VectorAdditionCheckboxOptions, SelfOptions, CheckboxOptions>()( {

      // CheckboxOptions
      isDisposable: false,
      boxWidth: VectorAdditionConstants.CHECKBOX_BOX_WIDTH,
      touchAreaXDilation: 5,
      touchAreaYDilation: 3.5
    }, providedOptions );

    super( property, content, options );
  }
}

vectorAddition.register( 'VectorAdditionCheckbox', VectorAdditionCheckbox );