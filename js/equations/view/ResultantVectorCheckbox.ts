// Copyright 2025, University of Colorado Boulder

/**
 * ResultantVectorCheckbox is the checkbox for the resultant vector in the graph control panel for the 'Equations' screen.
 * It changes its label and vector color depending on which scene is selected.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import VectorAdditionSymbols from '../../common/VectorAdditionSymbols.js';
import ArrowOverSymbolNode from '../../common/view/ArrowOverSymbolNode.js';
import VectorAdditionIconFactory from '../../common/view/VectorAdditionIconFactory.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import EquationsScene from '../model/EquationsScene.js';

export default class ResultantVectorCheckbox extends Checkbox {

  public constructor( resultantVectorVisibleProperty: Property<boolean>,
                      sceneProperty: TReadOnlyProperty<EquationsScene>,
                      cartesianScene: EquationsScene,
                      polarScene: EquationsScene,
                      tandem: Tandem ) {

    const accessibleSymbolProperty = new DerivedStringProperty( [ sceneProperty ],
      scene => scene.vectorSet.resultantVector.accessibleSymbolProperty.value );

    const options = combineOptions<CheckboxOptions>( {}, VectorAdditionConstants.CHECKBOX_OPTIONS, {

      // CheckboxOptions
      isDisposable: false,
      accessibleName: new PatternStringProperty( VectorAdditionStrings.a11y.equationsSumCheckbox.accessibleNameStringProperty, {
        symbol: accessibleSymbolProperty
      } ),

      // "Show or hide vector {{symbol}}."
      accessibleHelpText: new PatternStringProperty( VectorAdditionStrings.a11y.sumCheckbox.accessibleHelpTextStringProperty, {
        symbol: accessibleSymbolProperty
      } ),

      // "Vector {{symbol}} visibility enabled."
      accessibleContextResponseChecked: new PatternStringProperty( VectorAdditionStrings.a11y.sumCheckbox.accessibleContextResponseCheckedStringProperty, {
        symbol: accessibleSymbolProperty
      } ),

      // "Vector {{symbol}} visibility disabled."
      accessibleContextResponseUnchecked: new PatternStringProperty( VectorAdditionStrings.a11y.sumCheckbox.accessibleContextResponseUncheckedStringProperty, {
        symbol: accessibleSymbolProperty
      } ),
      tandem: tandem
    } );

    // what is getAccessibleStringProperty? // TODO: SR: see https://github.com/phetsims/vector-addition/issues/376
    const cSymbolNode = new ArrowOverSymbolNode( RichText.getAccessibleStringProperty( VectorAdditionSymbols.cStringProperty ), {
      visibleProperty: new DerivedProperty( [ sceneProperty ], scene => scene === cartesianScene ),
      maxWidth: 95 // determined empirically
    } );

    const fSymbolNode = new ArrowOverSymbolNode( RichText.getAccessibleStringProperty( VectorAdditionSymbols.fStringProperty ), {
      visibleProperty: new DerivedProperty( [ sceneProperty ], scene => scene === polarScene ),
      maxWidth: 95 // determined empirically
    } );

    // To make both symbols have the same effective size, so that control panel layout doesn't shift.
    const alignGroup = new AlignGroup();

    const symbolNode = new Node( {
      children: [
        alignGroup.createBox( cSymbolNode ),
        alignGroup.createBox( fSymbolNode )
      ]
    } );

    const vectorIcon = VectorAdditionIconFactory.createVectorIcon( 35, {
      fill: new DerivedProperty( [
        sceneProperty,
        cartesianScene.vectorSet.vectorColorPalette.sumFillProperty,
        polarScene.vectorSet.vectorColorPalette.sumFillProperty
      ], scene => scene.vectorSet.vectorColorPalette.sumFillProperty.value ),
      stroke: new DerivedProperty( [
        sceneProperty,
        cartesianScene.vectorSet.vectorColorPalette.sumStrokeProperty,
        polarScene.vectorSet.vectorColorPalette.sumStrokeProperty
      ], scene => scene.vectorSet.vectorColorPalette.sumStrokeProperty.value )
    } );

    const hBox = new HBox( {
      spacing: 8,
      children: [ symbolNode, vectorIcon ]
    } );

    // Wrap in a Node so that label and icon do not get separated when the checkbox layout is stretched.
    const content = new Node( {
      children: [ hBox ]
    } );

    super( resultantVectorVisibleProperty, content, options );
  }
}

vectorAddition.register( 'ResultantVectorCheckbox', ResultantVectorCheckbox );