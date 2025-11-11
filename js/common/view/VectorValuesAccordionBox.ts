// Copyright 2019-2025, University of Colorado Boulder

/**
 * VectorValuesAccordionBox displays a vector's magnitude, angle, x component, and y component.
 * When collapsed, it displays 'Vector Values'. When expanded, it either displays the selected vector's
 * attributes, or 'No vector selected' if no vector is selected.
 *
 * @author Martin Veillette
 * @author Brandon Li
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import EquationsVector from '../../equations/model/EquationsVector.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import Vector from '../model/Vector.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorAdditionSymbols from '../VectorAdditionSymbols.js';
import FixedSizeAccordionBox, { FixedSizeAccordionBoxOptions } from './FixedSizeAccordionBox.js';
import VectorQuantityDisplay from './VectorQuantityDisplay.js';
import VectorSymbolNode from './VectorSymbolNode.js';
import { VectorValuesAccessibleParagraphProperty } from './VectorValuesAccessibleParagraphProperty.js';
import { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

// Spacing between the label and number display.
const LABEL_DISPLAY_SPACING = 7;

// maxWidth for display labels
const MAGNITUDE_LABEL_MAX_WIDTH = 50;
const ANGLE_LABEL_MAX_WIDTH = 15;
const COMPONENT_LABEL_MAX_WIDTH = 35;

type SelfOptions = EmptySelfOptions;

type VectorValuesAccordionBoxOptions = SelfOptions & NodeTranslationOptions &
  PickRequired<FixedSizeAccordionBoxOptions, 'tandem' | 'expandedProperty'>;

export default class VectorValuesAccordionBox extends FixedSizeAccordionBox {

  // For core description, the accessible paragraph for this accordion box describes the selected vector.
  // For there is no selected vector, the accessible paragraph is set to null.
  private accessibleParagraphStringProperty: TReadOnlyProperty<string> | null;

  public constructor( selectedVectorProperty: TReadOnlyProperty<Vector | null>,
                      graphBounds: Bounds2,
                      providedOptions: VectorValuesAccordionBoxOptions ) {

    const options = optionize<VectorValuesAccordionBoxOptions, SelfOptions, FixedSizeAccordionBoxOptions>()( {

      // FixedSizeAccordionBoxOptions
      contentFixedSize: new Dimension2( 500, 45 ),
      contentAlign: 'center',
      contentXSpacing: 5,
      titleXSpacing: 15,
      accessibleHelpTextCollapsed: VectorAdditionStrings.a11y.vectorValuesAccordionBox.accessibleHelpTextCollapsedStringProperty
    }, providedOptions );

    // 'Vector Values' title
    const titleText = new Text( VectorAdditionStrings.vectorValuesStringProperty, {
      font: VectorAdditionConstants.TITLE_FONT,
      maxWidth: 450
    } );

    // 'No vector selected', displayed when the accordion box is expanded and no vector is selected.
    const noVectorSelectedText = new Text( VectorAdditionStrings.noVectorSelectedStringProperty, {
      visibleProperty: new DerivedProperty( [ selectedVectorProperty ], selectedVector => selectedVector === null ),
      font: VectorAdditionConstants.TITLE_FONT,
      maxWidth: 450,
      accessibleParagraph: VectorAdditionStrings.noVectorSelectedStringProperty
    } );

    // Magnitude
    const magnitudeSymbolNode = new VectorSymbolNode( {
      includeAbsoluteValueBars: true,
      maxWidth: MAGNITUDE_LABEL_MAX_WIDTH
    } );
    const magnitudeQuantityDisplay = new VectorQuantityDisplay( 'magnitude', selectedVectorProperty, graphBounds );
    const magnitudeDisplay = new HBox( {
      spacing: LABEL_DISPLAY_SPACING,
      children: [ magnitudeSymbolNode, magnitudeQuantityDisplay ],
      tandem: options.tandem.createTandem( 'magnitudeDisplay' ),
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );

    // Angle
    const angleSymbolNode = new RichText( VectorAdditionSymbols.THETA, {
      font: VectorAdditionConstants.EQUATION_SYMBOL_FONT,
      maxWidth: ANGLE_LABEL_MAX_WIDTH
    } );
    const angleQuantityDisplay = new VectorQuantityDisplay( 'angle', selectedVectorProperty, graphBounds );
    const angleDisplay = new HBox( {
      spacing: LABEL_DISPLAY_SPACING,
      children: [ angleSymbolNode, angleQuantityDisplay ],
      tandem: options.tandem.createTandem( 'angleDisplay' ),
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );

    // x-component
    const xComponentSymbolNode = new VectorSymbolNode( {
      showVectorArrow: false,
      maxWidth: COMPONENT_LABEL_MAX_WIDTH
    } );
    const xComponentQuantityDisplay = new VectorQuantityDisplay( 'xComponent', selectedVectorProperty, graphBounds );
    const xComponentDisplay = new HBox( {
      spacing: LABEL_DISPLAY_SPACING,
      children: [ xComponentSymbolNode, xComponentQuantityDisplay ],
      tandem: options.tandem.createTandem( 'xComponentDisplay' ),
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );

    // y-component
    const yComponentSymbolNode = new VectorSymbolNode( {
      showVectorArrow: false,
      maxWidth: COMPONENT_LABEL_MAX_WIDTH
    } );
    const yComponentQuantityDisplay = new VectorQuantityDisplay( 'yComponent', selectedVectorProperty, graphBounds );
    const yComponentDisplay = new HBox( {
      spacing: LABEL_DISPLAY_SPACING,
      children: [ yComponentSymbolNode, yComponentQuantityDisplay ],
      tandem: options.tandem.createTandem( 'yComponentDisplay' ),
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );

    // Layout for the labels and displays.
    const vectorQuantitiesHBox = new HBox( {
      visibleProperty: new DerivedProperty( [ selectedVectorProperty ], selectedVector => selectedVector !== null ),
      spacing: 40,
      children: [

        // magnitude and angle
        new HBox( {
          spacing: 20,
          children: [ magnitudeDisplay, angleDisplay ]
        } ),

        // x-component and y-component
        new HBox( {
          spacing: 20,
          children: [ xComponentDisplay, yComponentDisplay ]
        } )
      ]
    } );

    // Content displayed when the accordion box is expanded.
    const expandedContent = new VBox( {
      children: [ noVectorSelectedText, vectorQuantitiesHBox ]
    } );

    const coefficientListener = ( coefficient: number ) => {
      magnitudeSymbolNode.setCoefficient( coefficient );
      xComponentSymbolNode.setCoefficient( coefficient );
      yComponentSymbolNode.setCoefficient( coefficient );
    };

    // Update when the selected vector changes.
    selectedVectorProperty.link( ( selectedVector, oldSelectedVector ) => {

      if ( selectedVector !== null ) {

        // Get the vector symbol
        const vectorSymbolProperty = selectedVector.symbolProperty;

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
        affirm( !selectedVector.coefficientProperty.hasListener( coefficientListener ),
          `vector ${selectedVector.accessibleSymbolProperty.value} coefficientProperty already has coefficientListener.` );
        selectedVector.coefficientProperty.link( coefficientListener ); // unlink required when selected vector changes
      }

      if ( oldSelectedVector && oldSelectedVector instanceof EquationsVector ) {
        oldSelectedVector.coefficientProperty.unlink( coefficientListener );
        // reset
        coefficientListener( ( selectedVector && selectedVector instanceof EquationsVector ) ? selectedVector.coefficientProperty.value : 1 );
      }
    } );

    super( titleText, expandedContent, options );

    this.accessibleParagraphStringProperty = null;

    // Set the accessible paragraph that describes the selected vector.
    selectedVectorProperty.link( selectedVector => {
      this.accessibleParagraphStringProperty && this.accessibleParagraphStringProperty.dispose();
      this.accessibleParagraphStringProperty = null;
      if ( selectedVector ) {
        this.accessibleParagraphStringProperty = new VectorValuesAccessibleParagraphProperty( selectedVector );
        vectorQuantitiesHBox.setAccessibleParagraph( this.accessibleParagraphStringProperty );
      }
    } );

    // When the accordion box is expanded or collapsed, cancel interactions.
    this.expandedProperty.lazyLink( () => this.interruptSubtreeInput() );
  }
}

vectorAddition.register( 'VectorValuesAccordionBox', VectorValuesAccordionBox );