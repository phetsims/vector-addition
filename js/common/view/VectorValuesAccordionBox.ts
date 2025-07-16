// Copyright 2019-2025, University of Colorado Boulder

/**
 * VectorValuesAccordionBox is the accordion box at the top of the screen. It displays the selected vector's magnitude,
 * angle, x component, and y component.
 *
 * 'Is a' relationship with FixedSizeAccordionBox
 *    - when collapsed, displays 'Vector Values'
 *    - when expanded either displays 'select a vector' or the selected vector's attributes
 *      (a series of labels and VectorQuantityDisplays)
 *
 * This panel exists for the entire sim and is never disposed.
 *
 * @author Martin Veillette
 * @author Brandon Li
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import EquationsVector from '../../equations/model/EquationsVector.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import VectorAdditionScene from '../model/VectorAdditionScene.js';
import Vector from '../model/Vector.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorAdditionSymbols from '../VectorAdditionSymbols.js';
import FixedSizeAccordionBox, { FixedSizeAccordionBoxOptions } from './FixedSizeAccordionBox.js';
import VectorSymbolNode from './VectorSymbolNode.js';
import VectorQuantityDisplay from './VectorQuantityDisplay.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';

// Spacing between the label and number display.
const LABEL_DISPLAY_SPACING = 7;

// maxWidth for display labels
const MAGNITUDE_LABEL_MAX_WIDTH = 50;
const ANGLE_LABEL_MAX_WIDTH = 15;
const COMPONENT_LABEL_MAX_WIDTH = 35;

type SelfOptions = EmptySelfOptions;

type VectorValuesAccordionBoxOptions = SelfOptions & StrictOmit<FixedSizeAccordionBoxOptions, 'contentFixedSize'>;

export default class VectorValuesAccordionBox extends FixedSizeAccordionBox {

  private accessibleParagraphStringProperty: TReadOnlyProperty<string> | null;

  public constructor( scene: VectorAdditionScene, providedOptions: VectorValuesAccordionBoxOptions ) {

    const options = optionize<VectorValuesAccordionBoxOptions, SelfOptions, FixedSizeAccordionBoxOptions>()( {

      // FixedSizeAccordionBoxOptions
      contentFixedSize: new Dimension2( 500, 45 ),
      contentAlign: 'center',
      contentXSpacing: 5,
      titleXSpacing: 15
    }, providedOptions );

    // 'Vector Values' title
    const titleText = new Text( VectorAdditionStrings.vectorValuesStringProperty, {
      font: VectorAdditionConstants.TITLE_FONT,
      maxWidth: 450
    } );

    // 'No vector selected', displayed when accordion box is expanded and no vector is selected.
    const noVectorSelectedText = new Text( VectorAdditionStrings.noVectorSelectedStringProperty, {
      visibleProperty: new DerivedProperty( [ scene.selectedVectorProperty ], selectedVector => selectedVector === null ),
      font: VectorAdditionConstants.TITLE_FONT,
      maxWidth: 450,
      accessibleParagraph: VectorAdditionStrings.noVectorSelectedStringProperty
    } );

    // Labels and displays for the vector quantities.
    const magnitudeSymbolNode = new VectorSymbolNode( {
      includeAbsoluteValueBars: true,
      maxWidth: MAGNITUDE_LABEL_MAX_WIDTH
    } );
    const magnitudeDisplay = new VectorQuantityDisplay( scene, 'magnitude' );

    const angleSymbolNode = new Text( MathSymbols.THETA, {
      font: VectorAdditionConstants.EQUATION_SYMBOL_FONT,
      maxWidth: ANGLE_LABEL_MAX_WIDTH
    } );
    const angleDisplay = new VectorQuantityDisplay( scene, 'angle' );

    const xComponentSymbolNode = new VectorSymbolNode( {
      showVectorArrow: false,
      maxWidth: COMPONENT_LABEL_MAX_WIDTH
    } );
    const xComponentDisplay = new VectorQuantityDisplay( scene, 'xComponent' );

    const yComponentSymbolNode = new VectorSymbolNode( {
      showVectorArrow: false,
      maxWidth: COMPONENT_LABEL_MAX_WIDTH
    } );
    const yComponentDisplay = new VectorQuantityDisplay( scene, 'yComponent' );

    // Layout for the labels and displays.
    const vectorQuantitiesHBox = new HBox( {
      visibleProperty: new DerivedProperty( [ scene.selectedVectorProperty ], selectedVector => selectedVector !== null ),
      spacing: 40,
      children: [
        new HBox( {
          spacing: 20,
          children: [
            new HBox( {
              spacing: LABEL_DISPLAY_SPACING,
              children: [ magnitudeSymbolNode, magnitudeDisplay ],
              tandem: options.tandem.createTandem( 'magnitudeDisplay' )
            } ),
            new HBox( {
              spacing: LABEL_DISPLAY_SPACING,
              children: [ angleSymbolNode, angleDisplay ],
              tandem: options.tandem.createTandem( 'angleDisplay' )
            } )
          ]
        } ),
        new HBox( {
          spacing: 20,
          children: [
            new HBox( {
              spacing: LABEL_DISPLAY_SPACING,
              children: [ xComponentSymbolNode, xComponentDisplay ],
              tandem: options.tandem.createTandem( 'xComponentDisplay' )
            } ),
            new HBox( {
              spacing: LABEL_DISPLAY_SPACING,
              children: [ yComponentSymbolNode, yComponentDisplay ],
              tandem: options.tandem.createTandem( 'yComponentDisplay' )
            } )
          ]
        } )
      ]
    } );

    // Content displayed when the accordion box is expanded.
    const expandedContent = new VBox( {
      children: [ noVectorSelectedText, vectorQuantitiesHBox ]
    } );

    const updateCoefficient = ( coefficient: number ) => {
      magnitudeSymbolNode.setCoefficient( coefficient );
      xComponentSymbolNode.setCoefficient( coefficient );
      yComponentSymbolNode.setCoefficient( coefficient );
    };

    // Update when selected vector changes.
    scene.selectedVectorProperty.link( ( selectedVector, oldSelectedVector ) => {

      if ( selectedVector !== null ) {

        // Get the vector symbol
        const vectorSymbolProperty = selectedVector.symbolProperty ? selectedVector.symbolProperty : Vector.FALLBACK_SYMBOL_PROPERTY;

        // Update labels (angle label is the same)
        magnitudeSymbolNode.setSymbolProperty( vectorSymbolProperty );
        xComponentSymbolNode.setSymbolProperty( new DerivedStringProperty(
          [ vectorSymbolProperty, VectorAdditionSymbols.xStringProperty ],
          ( vectorSymbol, xString ) => `${vectorSymbol}<sub>${xString}</sub>`
        ) );
        yComponentSymbolNode.setSymbolProperty( new DerivedStringProperty(
          [ vectorSymbolProperty, VectorAdditionSymbols.yStringProperty ],
          ( vectorSymbol, yString ) => `${vectorSymbol}<sub>${yString}</sub>`
        ) );
      }

      if ( selectedVector && selectedVector instanceof EquationsVector ) {
        selectedVector.coefficientProperty.link( updateCoefficient ); // unlink required when selected vector changes
      }

      if ( oldSelectedVector && oldSelectedVector instanceof EquationsVector ) {
        oldSelectedVector.coefficientProperty.unlink( updateCoefficient );
        // reset
        updateCoefficient( ( selectedVector && selectedVector instanceof EquationsVector ) ? selectedVector.coefficientProperty.value : 1 );
      }
    } );

    super( titleText, expandedContent, options );

    this.accessibleParagraphStringProperty = null;

    // Set the accessible paragraph that describes the selected vector.
    scene.selectedVectorProperty.link( selectedVector => {
      this.accessibleParagraphStringProperty && this.accessibleParagraphStringProperty.dispose();
      this.accessibleParagraphStringProperty = null;
      if ( selectedVector ) {
        this.accessibleParagraphStringProperty = new SelectedVectorAccessibleParagraphStringProperty( selectedVector );
        this.setAccessibleParagraph( this.accessibleParagraphStringProperty );
      }
    } );
  }
}

/**
 * SelectedVectorAccessibleParagraphStringProperty is the accessible paragraph that describes the vector that is
 * currently selected.
 */
class SelectedVectorAccessibleParagraphStringProperty extends PatternStringProperty<{
  symbol: TReadOnlyProperty<string>;
  magnitude: TReadOnlyProperty<string>;
  direction: TReadOnlyProperty<string>;
  xComponent: TReadOnlyProperty<string>;
  yComponent: TReadOnlyProperty<string>;
}> {
  public constructor( selectedVector: Vector ) {

    const symbolProperty = selectedVector.symbolProperty ? selectedVector.symbolProperty : Vector.FALLBACK_SYMBOL_PROPERTY;

    const magnitudeProperty = new DerivedProperty( [ selectedVector.vectorComponentsProperty ],
      () => toFixed( selectedVector.magnitude, VectorAdditionConstants.VECTOR_VALUE_DECIMAL_PLACES ) );
    const directionProperty = new DerivedProperty( [ selectedVector.vectorComponentsProperty ],
      () => toFixed( selectedVector.getAngleDegrees() || 0, VectorAdditionConstants.VECTOR_VALUE_DECIMAL_PLACES ) );
    const xComponentProperty = new DerivedProperty( [ selectedVector.vectorComponentsProperty ],
      vectorComponents => toFixed( vectorComponents.x, VectorAdditionConstants.VECTOR_VALUE_DECIMAL_PLACES ) );
    const yComponentProperty = new DerivedProperty( [ selectedVector.vectorComponentsProperty ],
      vectorComponents => toFixed( vectorComponents.y, VectorAdditionConstants.VECTOR_VALUE_DECIMAL_PLACES ) );

    super( VectorAdditionStrings.a11y.vectorValuesAccordionBox.accessibleParagraphStringProperty, {
      symbol: symbolProperty,
      magnitude: magnitudeProperty,
      direction: directionProperty,
      xComponent: xComponentProperty,
      yComponent: yComponentProperty
    } );

    this.disposeEmitter.addListener( () => {
      magnitudeProperty.dispose();
      directionProperty.dispose();
      xComponentProperty.dispose();
      yComponentProperty.dispose();
    } );
  }
}

vectorAddition.register( 'VectorValuesAccordionBox', VectorValuesAccordionBox );