// Copyright 2025, University of Colorado Boulder

/**
 * EquationsSumCheckbox is the checkbox for the sum vector in the graph control panel for the 'Equations' screen.
 * It changes its label and vector color depending on which scene is selected.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import vectorAddition from '../../vectorAddition.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import EquationsScene from '../model/EquationsScene.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionSymbols from '../../common/VectorAdditionSymbols.js';
import Property from '../../../../axon/js/Property.js';
import ArrowOverSymbolNode from '../../common/view/ArrowOverSymbolNode.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import VectorAdditionIconFactory from '../../common/view/VectorAdditionIconFactory.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';

export default class EquationsSumCheckbox extends Checkbox {

  public constructor( sumVisibleProperty: Property<boolean>,
                      sceneProperty: TReadOnlyProperty<EquationsScene>,
                      cartesianScene: EquationsScene,
                      polarScene: EquationsScene,
                      tandem: Tandem ) {

    const cSymbolNode = new ArrowOverSymbolNode( VectorAdditionSymbols.cStringProperty, {
      visibleProperty: new DerivedProperty( [ sceneProperty ], scene => scene === cartesianScene ),
      maxWidth: 95 // determined empirically
    } );

    const fSymbolNode = new ArrowOverSymbolNode( VectorAdditionSymbols.fStringProperty, {
      visibleProperty: new DerivedProperty( [ sceneProperty ], scene => scene === polarScene ),
      maxWidth: 95 // determined empirically
    } );

    const symbolProperty = new DerivedStringProperty( [ sceneProperty ], scene => scene.vectorSet.symbolProperties[ 2 ].value );

    // To make both symbols have the same effective size, so that control panel layout doesn't shift around.
    const alignGroup = new AlignGroup();

    const symbolNode = new Node( {
      children: [
        alignGroup.createBox( cSymbolNode ),
        alignGroup.createBox( fSymbolNode )
      ]
    } );

    const vectorIcon = VectorAdditionIconFactory.createVectorIcon( 35, {
      fill: new DerivedProperty( [ sceneProperty ], scene => scene.vectorSet.vectorColorPalette.sumFill ),
      stroke: new DerivedProperty( [ sceneProperty ], scene => scene.vectorSet.vectorColorPalette.sumStroke )
    } );

    const hBox = new HBox( {
      spacing: VectorAdditionConstants.CHECKBOX_ICON_SPACING,
      children: [ symbolNode, vectorIcon ]
    } );

    // Wrap in a Node so that label and icon do not get separated when the checkbox layout is stretched.
    const content = new Node( {
      children: [ hBox ]
    } );

    super( sumVisibleProperty, content, {
      accessibleName: new PatternStringProperty( VectorAdditionStrings.a11y.equationsSumCheckbox.accessibleNameStringProperty, {
        symbol: symbolProperty
      } ),
      accessibleHelpText: new PatternStringProperty( VectorAdditionStrings.a11y.equationsSumCheckbox.accessibleHelpTextStringProperty, {
        symbol: symbolProperty
      } ),
      tandem: tandem
    } );
  }
}

vectorAddition.register( 'EquationsSumCheckbox', EquationsSumCheckbox );