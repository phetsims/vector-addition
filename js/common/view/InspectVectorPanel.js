// Copyright 2019, University of Colorado Boulder

/**
 * View for the 'Inspect a Vector' Panel at the top of the scene. Displays vector attributes (i.e label, magnitude etc.)
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  const FormulaNode = require( 'SCENERY_PHET/FormulaNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const Panel = require( 'SUN/Panel' );
  const Range = require( 'DOT/Range' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  // strings
  const inspectAVectorString = require( 'string!VECTOR_ADDITION/inspectAVector' );
  const selectAVectorString = require( 'string!VECTOR_ADDITION/selectAVector' );
  const xString = require( 'string!VECTOR_ADDITION/x' );
  const yString = require( 'string!VECTOR_ADDITION/y' );

  // constants
  const CREATOR_PANEL_WIDTH = 430;
  const CREATOR_PANEL_HEIGHT = 50;

  const CREATOR_PANEL_OPTIONS = _.extend( {}, VectorAdditionConstants.PANEL_OPTIONS, {
    cornerRadius: 5,
    xMargin: 7,
    yMargin: 2,
    minWidth: CREATOR_PANEL_WIDTH,
    maxWidth: CREATOR_PANEL_WIDTH,
    maxHeight: CREATOR_PANEL_HEIGHT,
    fill: VectorAdditionColors.INSPECT_VECTOR_BACKGROUND,
    stroke: VectorAdditionColors.PANEL_STROKE_COLOR
  } );

  const EXPAND_COLLAPSE_BUTTON_OPTIONS = {
    sideLength: 21
  };
  const PANEL_FONT = VectorAdditionConstants.PANEL_FONT;
  const EXPAND_COLLAPSE_BUTTON_RIGHT_MARGIN = 10;

  class InspectVectorPanel extends Panel {
    /**
     * @constructor
     * @param {Array.<VectorSet>} vectorSets - the vectorSets that will be able to be displayed
     * @param {Object} [options]
     */
    constructor( vectorSets, options ) {

      options = _.extend( {
        isExpandedInitially: false // {boolean} - true means the panel will start off as expanded
      }, options );

      assert && assert( vectorSets.filter( vectorSet => !( vectorSet instanceof VectorSet ).length === 0 ),
        `invalid vectorSets: ${vectorSets}` );
      assert && assert( typeof options.isExpandedInitially === 'boolean',
        `invalid options.isExpandedInitially: ${options.isExpandedInitially}` );

      //----------------------------------------------------------------------------------------

      const panelContent = new AlignBox( new Node(), {
        xAlign: 'center',
        yAlign: 'center'
      } );

      super( panelContent, CREATOR_PANEL_OPTIONS );

      // @private {BooleanProperty}
      this.expandedProperty = new BooleanProperty( options.isExpandedInitially );

      //----------------------------------------------------------------------------------------
      // Create the scenery nodes that always exist

      // @private {ExpandCollapseButton}
      this.expandCollapseButton = new ExpandCollapseButton( this.expandedProperty,
        _.extend( EXPAND_COLLAPSE_BUTTON_OPTIONS, {
          centerY: this.centerY
        } ) );

      // @private {Text}
      this.inspectVectorText = new Text( inspectAVectorString, {
        font: PANEL_FONT,
        centerY: this.centerY,
        left: this.expandCollapseButton.right + EXPAND_COLLAPSE_BUTTON_RIGHT_MARGIN
      } );

      // @private {Text}
      this.selectVectorText = new Text( selectAVectorString, {
        font: PANEL_FONT
      } );

      // @private {HBox} - this is the container for the attributes of the vector (i.e. magnitude, angle, x and
      // y components)
      this.vectorAttributesDisplayContainer = new HBox( {
        spacing: 15,
        align: 'center',
        children: [ this.selectVectorText ]
      } );

      //----------------------------------------------------------------------------------------

      panelContent.setChildren( [
        this.expandCollapseButton,
        this.inspectVectorText,
        // Constrain the size of this.vectorAttributesDisplayContainer
        new AlignBox( this.vectorAttributesDisplayContainer, {
          xAlign: 'left',
          yAlign: 'center',
          alignBounds: new Bounds2(
            0,
            0,
            CREATOR_PANEL_WIDTH - this.expandCollapseButton.right - EXPAND_COLLAPSE_BUTTON_RIGHT_MARGIN,
            CREATOR_PANEL_HEIGHT - 2 * CREATOR_PANEL_OPTIONS.yMargin ),
          centerY: this.centerY,
          left: this.expandCollapseButton.right + EXPAND_COLLAPSE_BUTTON_RIGHT_MARGIN
        } )
      ] );

      //----------------------------------------------------------------------------------------

      // observe changes to the expanded property (when the expanded collapse button is clicked)
      this.expandedProperty.link( ( isExpanded ) => {
        this.inspectVectorText.visible = !isExpanded;
        this.vectorAttributesDisplayContainer.visible = isExpanded;
      } );

      // @private {boolean} flag to indicate if this panel has displayed a vector's attributes
      this.hasDisplayedVectorAttributes = false;
    

      //----------------------------------------------------------------------------------------

      vectorSets.forEach( ( vectorSet ) => {

        const vectorSumActiveListener = ( isActive ) => {
          if ( isActive ) {
            this.displayVectorsAttributes( vectorSet.vectorSum );
          }
        };

        // Observe changes to the vector sum, when it is active, display it
        vectorSet.vectorSum.isActiveProperty.link( vectorSumActiveListener );

        // Observe changes to the vectors, when an item is added, add a link to display the vector when it's active
        vectorSet.vectors.addItemAddedListener( ( addedVector ) => {

          const vectorActiveListener = ( isActive ) => {
            if ( isActive ) {
              this.displayVectorsAttributes( addedVector );
            }
          };

          addedVector.isActiveProperty.link( vectorActiveListener );


          const vectorRemovedListener = function( removedVector ) {
            if ( removedVector === addedVector ) {
              removedVector.isActiveProperty.unlink( vectorActiveListener );
              vectorSet.vectors.removeItemRemovedListener( vectorRemovedListener );
            }
          };

          vectorSet.vectors.addItemRemovedListener( vectorRemovedListener );
        } );
      } );
    }

    /**
     * Displays a vectors attributes
     * @param {VectorModel} - activeVector
     * @private
     */
    displayVectorsAttributes( activeVector ) {

      // If we haven't displayed a single vector yet, this will be the first time. Thus, dispose the 'Select a Vector'
      // text and create the new Nodes.
      if ( !this.hasDisplayedVectorAttributes ) {
        this.hasDisplayedVectorAttributes = true;

        this.selectVectorText.dispose();

        this.createDisplayVectorNodes();
      }

      //----------------------------------------------------------------------------------------
      // Magnitude

      this.magnitudeTextNode.setFormula( `\|\\mathbf{\\vec{${activeVector.label}\}\}|` );

      this.magnitudeDisplayNode.setChildren( [
        new NumberDisplay(
          activeVector.magnitudeProperty,
          new Range( 0, 100 ), { 
            decimalPlaces: 1
          } )
      ] );

      //----------------------------------------------------------------------------------------
      // Angle

      this.angleDisplayNode.setChildren( [
        new NumberDisplay(
          activeVector.angleDegreesProperty,
          new Range( -180, 180 ), { 
            decimalPlaces: 1
          } )
      ] );

      //----------------------------------------------------------------------------------------
      // X component

      this.xComponentText.setText( `${activeVector.label}<sub>${xString}</sub>` );
      
      this.xComponentDisplayNode.setChildren( [
        new NumberDisplay(
          activeVector.xComponentProperty,
          new Range( -60, 60 ), { 
            decimalPlaces: 0
          } )
      ] );

      //----------------------------------------------------------------------------------------
      // Y component 

      this.yComponentText.setText( `${activeVector.label}<sub>${yString}</sub>` );

      this.yComponentDisplayNode.setChildren( [
        new NumberDisplay(
          activeVector.yComponentProperty,
          new Range( -40, 40 ), { 
            decimalPlaces: 0
          } )
      ] );
    }

    /**
     * Creates the scenery nodes for displaying a vectors attributes
     * @private
     */
    createDisplayVectorNodes( activeVector ) {

      //----------------------------------------------------------------------------------------
      // Magnitude

      // @private {FormulaNode}
      this.magnitudeTextNode = new FormulaNode( '' );

      // @private {Node} - arbitrary node for now
      this.magnitudeDisplayNode = new Node();

      //----------------------------------------------------------------------------------------
      // Angle

      // @private {RichText}
      this.angleText = new RichText( MathSymbols.THETA );

      // @private {Node}
      this.angleDisplayNode = new Node();

      //----------------------------------------------------------------------------------------
      // X Component

      // @private {RichText}
      this.xComponentText = new RichText( '' );
     
      // @private {Node}
      this.xComponentDisplayNode = new Node();
      //----------------------------------------------------------------------------------------
      // Y Component

      // @private {RichText}
      this.yComponentText = new RichText( '' );

      // @private {Node}
      this.yComponentDisplayNode = new Node();


      this.vectorAttributesDisplayContainer.setChildren( [
        new HBox( {
          spacing: 8,
          children: [ this.magnitudeTextNode, this.magnitudeDisplayNode ]
        } ),
        new HBox( {
          spacing: 8,
          children: [ this.angleText, this.angleDisplayNode ]
        } ),
        new HBox( {
          spacing: 8,
          children: [ this.xComponentText, this.xComponentDisplayNode ]
        } ),
        new HBox( {
          spacing: 8,
          children: [ this.yComponentText, this.yComponentDisplayNode ]
        } )
      ] );
    }
    /**
     * Resets the status of the Inspect Vector Panel
     * @public
     */
    reset() {
      this.expandedProperty.reset();

      // See https://github.com/phetsims/vector-addition/issues/38, remove the nodes
      this.hasDisplayedVectorAttributes = false;

      this.selectVectorText = new Text( selectAVectorString, {
        font: PANEL_FONT
      } );

      this.vectorAttributesDisplayContainer.setChildren( [ this.selectVectorText ] );

    }
  }

  return vectorAddition.register( 'InspectVectorPanel', InspectVectorPanel );
} );

