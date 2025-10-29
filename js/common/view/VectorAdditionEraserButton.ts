// Copyright 2025, University of Colorado Boulder

/**
 * VectorAdditionEraserButton is the button that erases vectors from the graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EraserButton, { EraserButtonOptions } from '../../../../scenery-phet/js/buttons/EraserButton.js';
import vectorAddition from '../../vectorAddition.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import VectorAdditionColors from '../VectorAdditionColors.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';

type SelfOptions = EmptySelfOptions;

type VectorAdditionEraserButtonOptions = SelfOptions & NodeTranslationOptions &
  PickRequired<EraserButtonOptions, 'listener' | 'tandem'>;

export default class VectorAdditionEraserButton extends EraserButton {

  public constructor( numberOfVectorsOnGraphProperty: TReadOnlyProperty<number>,
                      providedOptions: VectorAdditionEraserButtonOptions ) {

    const options = optionize<VectorAdditionEraserButtonOptions, SelfOptions, EraserButtonOptions>()( {

      // EraserButtonOptions
      enabledProperty: new DerivedProperty( [ numberOfVectorsOnGraphProperty ],
        numberOfVectorsOnGraph => ( numberOfVectorsOnGraph !== 0 ), {
          tandem: providedOptions.tandem.createTandem( 'enabledProperty' ),
          phetioValueType: BooleanIO,
          phetioFeatured: true
        } ),
      baseColor: VectorAdditionColors.eraserButtonBaseColorProperty,
      touchAreaXDilation: 7,
      touchAreaYDilation: 7,
      accessibleName: VectorAdditionStrings.a11y.eraserButton.accessibleNameStringProperty,
      accessibleContextResponse: VectorAdditionStrings.a11y.eraserButton.accessibleContextResponseStringProperty
    }, providedOptions );

    super( options );
  }
}

vectorAddition.register( 'VectorAdditionEraserButton', VectorAdditionEraserButton );