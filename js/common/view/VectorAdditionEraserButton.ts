// Copyright 2025-2026, University of Colorado Boulder

/**
 * VectorAdditionEraserButton is the button that erases vectors from the graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import EraserButton, { EraserButtonOptions } from '../../../../scenery-phet/js/buttons/EraserButton.js';
import { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import VectorAdditionColors from '../VectorAdditionColors.js';

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
      accessibleHelpText: VectorAdditionStrings.a11y.eraserButton.accessibleHelpTextStringProperty,
      accessibleContextResponse: VectorAdditionStrings.a11y.eraserButton.accessibleContextResponseStringProperty
    }, providedOptions );

    super( options );
  }
}

vectorAddition.register( 'VectorAdditionEraserButton', VectorAdditionEraserButton );