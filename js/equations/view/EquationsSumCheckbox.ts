// Copyright 2025, University of Colorado Boulder

/**
 * EquationsSumCheckbox is the checkbox for the sum vector in the graph control panel for the 'Equations' screen.
 * It changes its label and vector color depending on which scene is selected.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import vectorAddition from '../../vectorAddition.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import EquationsScene from '../model/EquationsScene.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Property from '../../../../axon/js/Property.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import SumCheckbox from '../../common/view/SumCheckbox.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

export default class EquationsSumCheckbox extends SumCheckbox {

  public constructor( sumVisibleProperty: Property<boolean>,
                      sceneProperty: TReadOnlyProperty<EquationsScene>,
                      cartesianScene: EquationsScene,
                      polarScene: EquationsScene,
                      tandem: Tandem ) {

    const symbolProperty = new DerivedStringProperty(
      [ sceneProperty, cartesianScene.vectorSet.sumSymbolProperty, polarScene.vectorSet.sumSymbolProperty ],
      scene => scene.vectorSet.sumSymbolProperty.value );

    super( sumVisibleProperty, {

      // Vector {{vectorSymbol}}
      vectorIconFill: new DerivedProperty( [ sceneProperty ], scene => scene.vectorSet.vectorColorPalette.sumFill ),
      vectorIconStroke: new DerivedProperty( [ sceneProperty ], scene => scene.vectorSet.vectorColorPalette.sumStroke ),
      sumSymbolProperty: symbolProperty,
      sumSymbolDescriptionProperty: symbolProperty,
      accessibleName: new PatternStringProperty( VectorAdditionStrings.a11y.equationsSumCheckbox.accessibleNameStringProperty, {
        vectorSymbol: symbolProperty
      } ),
      tandem: tandem
    } );
  }
}

vectorAddition.register( 'EquationsSumCheckbox', EquationsSumCheckbox );